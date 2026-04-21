// REST API server for the LiquidJS REST demo.
// Provides a simple bookmarks CRUD API.
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
)

type Bookmark struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	URL   string `json:"url"`
	Tags  string `json:"tags"`
}

var (
	bookmarks = []Bookmark{
		{ID: 1, Title: "LiquidJS Docs", URL: "https://liquidjs.dev/docs", Tags: "docs,framework"},
		{ID: 2, Title: "Go Official", URL: "https://go.dev", Tags: "go,language"},
		{ID: 3, Title: "MDN Web Docs", URL: "https://developer.mozilla.org", Tags: "docs,web"},
	}
	mu     sync.RWMutex
	nextID atomic.Int32
)

func init() {
	nextID.Store(4)
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/bookmarks", handleBookmarks)
	mux.HandleFunc("/api/bookmarks/", handleBookmark)
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	handler := corsMiddleware(mux)

	log.Println("REST API server starting on :8080")
	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatal(err)
	}
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func handleBookmarks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case "GET":
		mu.RLock()
		json.NewEncoder(w).Encode(bookmarks)
		mu.RUnlock()

	case "POST":
		var b Bookmark
		if err := json.NewDecoder(r.Body).Decode(&b); err != nil {
			http.Error(w, `{"error":"invalid JSON"}`, http.StatusBadRequest)
			return
		}
		b.ID = int(nextID.Add(1)) - 1
		mu.Lock()
		bookmarks = append(bookmarks, b)
		mu.Unlock()
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(b)

	default:
		http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
	}
}

func handleBookmark(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	parts := strings.Split(strings.TrimPrefix(r.URL.Path, "/api/bookmarks/"), "/")
	id, err := strconv.Atoi(parts[0])
	if err != nil {
		http.Error(w, `{"error":"invalid id"}`, http.StatusBadRequest)
		return
	}

	switch r.Method {
	case "GET":
		mu.RLock()
		for _, b := range bookmarks {
			if b.ID == id {
				mu.RUnlock()
				json.NewEncoder(w).Encode(b)
				return
			}
		}
		mu.RUnlock()
		http.Error(w, `{"error":"not found"}`, http.StatusNotFound)

	case "DELETE":
		mu.Lock()
		for i, b := range bookmarks {
			if b.ID == id {
				bookmarks = append(bookmarks[:i], bookmarks[i+1:]...)
				mu.Unlock()
				w.WriteHeader(http.StatusNoContent)
				return
			}
		}
		mu.Unlock()
		http.Error(w, `{"error":"not found"}`, http.StatusNotFound)

	case "PUT":
		var updated Bookmark
		if err := json.NewDecoder(r.Body).Decode(&updated); err != nil {
			http.Error(w, `{"error":"invalid JSON"}`, http.StatusBadRequest)
			return
		}
		mu.Lock()
		for i, b := range bookmarks {
			if b.ID == id {
				updated.ID = id
				bookmarks[i] = updated
				mu.Unlock()
				json.NewEncoder(w).Encode(updated)
				return
			}
		}
		mu.Unlock()
		http.Error(w, fmt.Sprintf(`{"error":"bookmark %d not found"}`, id), http.StatusNotFound)

	default:
		http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
	}
}
