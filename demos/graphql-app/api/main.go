// GraphQL API server for the LiquidJS Contact Directory demo.
// Implements a minimal GraphQL endpoint without external libraries.
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
)

type Contact struct {
	ID         int    `json:"id"`
	Name       string `json:"name"`
	Email      string `json:"email"`
	Phone      string `json:"phone"`
	Department string `json:"department"`
}

type GraphQLRequest struct {
	Query     string                 `json:"query"`
	Variables map[string]interface{} `json:"variables,omitempty"`
}

type GraphQLResponse struct {
	Data   interface{}            `json:"data,omitempty"`
	Errors []map[string]string    `json:"errors,omitempty"`
}

var (
	contacts = []Contact{
		{ID: 1, Name: "Alice Johnson", Email: "alice@example.com", Phone: "555-0101", Department: "Engineering"},
		{ID: 2, Name: "Bob Smith", Email: "bob@example.com", Phone: "555-0102", Department: "Marketing"},
		{ID: 3, Name: "Carol Davis", Email: "carol@example.com", Phone: "555-0103", Department: "Engineering"},
		{ID: 4, Name: "Dan Wilson", Email: "dan@example.com", Phone: "555-0104", Department: "Sales"},
		{ID: 5, Name: "Eve Martinez", Email: "eve@example.com", Phone: "555-0105", Department: "HR"},
	}
	mu     sync.RWMutex
	nextID atomic.Int32
)

func init() {
	nextID.Store(6)
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/graphql", handleGraphQL)
	mux.HandleFunc("/health", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	handler := corsMiddleware(mux)

	log.Println("GraphQL API server starting on :8080")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatal(err)
	}
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func handleGraphQL(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(GraphQLResponse{
			Errors: []map[string]string{{"message": "only POST is supported"}},
		})
		return
	}

	var req GraphQLRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(GraphQLResponse{
			Errors: []map[string]string{{"message": "invalid JSON body"}},
		})
		return
	}

	query := strings.TrimSpace(req.Query)
	resp := routeQuery(query, req.Variables)
	json.NewEncoder(w).Encode(resp)
}

var (
	reContacts    = regexp.MustCompile(`(?s)^\{\s*contacts\s*\{`)
	reContactByID = regexp.MustCompile(`(?s)^\{\s*contact\s*\(\s*id\s*:\s*(\d+)\s*\)\s*\{`)
	reAddContact  = regexp.MustCompile(`(?s)^mutation\s*\{\s*addContact\s*\(`)
	reDeleteContact = regexp.MustCompile(`(?s)^mutation\s*\{\s*deleteContact\s*\(\s*id\s*:\s*(\d+)\s*\)`)
)

func routeQuery(query string, variables map[string]interface{}) GraphQLResponse {
	switch {
	case reContacts.MatchString(query):
		return handleContacts()
	case reContactByID.MatchString(query):
		return handleContactByID(query)
	case reAddContact.MatchString(query):
		return handleAddContact(query)
	case reDeleteContact.MatchString(query):
		return handleDeleteContact(query)
	default:
		return GraphQLResponse{
			Errors: []map[string]string{{"message": fmt.Sprintf("unsupported query: %s", query)}},
		}
	}
}

func handleContacts() GraphQLResponse {
	mu.RLock()
	result := make([]Contact, len(contacts))
	copy(result, contacts)
	mu.RUnlock()
	return GraphQLResponse{Data: map[string]interface{}{"contacts": result}}
}

func handleContactByID(query string) GraphQLResponse {
	matches := reContactByID.FindStringSubmatch(query)
	if len(matches) < 2 {
		return GraphQLResponse{Errors: []map[string]string{{"message": "invalid contact query"}}}
	}
	id, _ := strconv.Atoi(matches[1])

	mu.RLock()
	defer mu.RUnlock()
	for _, c := range contacts {
		if c.ID == id {
			return GraphQLResponse{Data: map[string]interface{}{"contact": c}}
		}
	}
	return GraphQLResponse{Data: map[string]interface{}{"contact": nil}}
}

func handleAddContact(query string) GraphQLResponse {
	name := extractStringField(query, "name")
	email := extractStringField(query, "email")
	phone := extractStringField(query, "phone")
	department := extractStringField(query, "department")

	if name == "" {
		return GraphQLResponse{Errors: []map[string]string{{"message": "name is required"}}}
	}

	c := Contact{
		ID:         int(nextID.Add(1)) - 1,
		Name:       name,
		Email:      email,
		Phone:      phone,
		Department: department,
	}

	mu.Lock()
	contacts = append(contacts, c)
	mu.Unlock()

	return GraphQLResponse{Data: map[string]interface{}{"addContact": c}}
}

func handleDeleteContact(query string) GraphQLResponse {
	matches := reDeleteContact.FindStringSubmatch(query)
	if len(matches) < 2 {
		return GraphQLResponse{Errors: []map[string]string{{"message": "invalid deleteContact mutation"}}}
	}
	id, _ := strconv.Atoi(matches[1])

	mu.Lock()
	defer mu.Unlock()
	for i, c := range contacts {
		if c.ID == id {
			contacts = append(contacts[:i], contacts[i+1:]...)
			return GraphQLResponse{Data: map[string]interface{}{"deleteContact": c}}
		}
	}
	return GraphQLResponse{Errors: []map[string]string{{"message": fmt.Sprintf("contact %d not found", id)}}}
}

// extractStringField pulls a named string field value from an inline GraphQL input block.
// e.g. from `addContact(input: { name: "Alice", email: "a@b.com" })` extracts "Alice" for field "name".
func extractStringField(query string, field string) string {
	pattern := regexp.MustCompile(field + `\s*:\s*"([^"]*)"`)
	matches := pattern.FindStringSubmatch(query)
	if len(matches) >= 2 {
		return matches[1]
	}
	return ""
}
