// Protobuf-like binary protocol API server for the LiquidJS Task Tracker demo.
// Uses encoding/binary for a custom wire format over HTTP.
package main

import (
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"sync/atomic"
)

// Status enum values matching the UI.
const (
	StatusPending    uint8 = 0
	StatusInProgress uint8 = 1
	StatusDone       uint8 = 2
)

// Task represents a task in the tracker.
type Task struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      uint8  `json:"status"`
	Priority    int    `json:"priority"`
}

// Binary wire format for a single task:
//   [4 bytes] ID          (uint32, big-endian)
//   [1 byte]  Status      (uint8)
//   [1 byte]  Priority    (uint8)
//   [2 bytes] TitleLen    (uint16, big-endian)
//   [N bytes] Title       (UTF-8)
//   [2 bytes] DescLen     (uint16, big-endian)
//   [N bytes] Description (UTF-8)
//
// A task list message is:
//   [4 bytes] Count       (uint32, big-endian)
//   [repeated] Task messages

func encodeTask(t Task) []byte {
	titleBytes := []byte(t.Title)
	descBytes := []byte(t.Description)
	buf := make([]byte, 4+1+1+2+len(titleBytes)+2+len(descBytes))
	offset := 0

	binary.BigEndian.PutUint32(buf[offset:], uint32(t.ID))
	offset += 4
	buf[offset] = t.Status
	offset++
	buf[offset] = uint8(t.Priority)
	offset++
	binary.BigEndian.PutUint16(buf[offset:], uint16(len(titleBytes)))
	offset += 2
	copy(buf[offset:], titleBytes)
	offset += len(titleBytes)
	binary.BigEndian.PutUint16(buf[offset:], uint16(len(descBytes)))
	offset += 2
	copy(buf[offset:], descBytes)

	return buf
}

func decodeTask(data []byte) (Task, int, error) {
	if len(data) < 10 {
		return Task{}, 0, fmt.Errorf("buffer too short for task header")
	}
	offset := 0

	id := binary.BigEndian.Uint32(data[offset:])
	offset += 4
	status := data[offset]
	offset++
	priority := data[offset]
	offset++
	titleLen := int(binary.BigEndian.Uint16(data[offset:]))
	offset += 2

	if len(data) < offset+titleLen+2 {
		return Task{}, 0, fmt.Errorf("buffer too short for title")
	}
	title := string(data[offset : offset+titleLen])
	offset += titleLen

	descLen := int(binary.BigEndian.Uint16(data[offset:]))
	offset += 2

	if len(data) < offset+descLen {
		return Task{}, 0, fmt.Errorf("buffer too short for description")
	}
	desc := string(data[offset : offset+descLen])
	offset += descLen

	return Task{
		ID:          int(id),
		Title:       title,
		Description: desc,
		Status:      status,
		Priority:    int(priority),
	}, offset, nil
}

func encodeTaskList(tasks []Task) []byte {
	buf := make([]byte, 4)
	binary.BigEndian.PutUint32(buf, uint32(len(tasks)))
	for _, t := range tasks {
		buf = append(buf, encodeTask(t)...)
	}
	return buf
}

var (
	tasks = []Task{
		{ID: 1, Title: "Set up project", Description: "Initialize repository and CI", Status: StatusDone, Priority: 5},
		{ID: 2, Title: "Design API schema", Description: "Define binary protocol wire format", Status: StatusInProgress, Priority: 4},
		{ID: 3, Title: "Build UI components", Description: "Create kanban board with LiquidJS", Status: StatusPending, Priority: 3},
		{ID: 4, Title: "Write tests", Description: "Unit and integration tests for encoder/decoder", Status: StatusPending, Priority: 2},
		{ID: 5, Title: "Deploy to staging", Description: "Docker compose setup with nginx proxy", Status: StatusPending, Priority: 1},
	}
	mu     sync.RWMutex
	nextID atomic.Int32
)

func init() {
	nextID.Store(6)
}

func main() {
	mux := http.NewServeMux()

	// Protobuf-like binary endpoints
	mux.HandleFunc("/proto/tasks", handleProtoTasks)
	mux.HandleFunc("/proto/tasks/", handleProtoTask)

	// JSON fallback endpoints for debugging
	mux.HandleFunc("/api/tasks", handleJSONTasks)
	mux.HandleFunc("/api/tasks/", handleJSONTask)

	mux.HandleFunc("/api/health", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	handler := corsMiddleware(mux)

	log.Println("Task Tracker API server starting on :8080")
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

// --- Proto (binary) handlers ---

func handleProtoTasks(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		mu.RLock()
		data := encodeTaskList(tasks)
		mu.RUnlock()
		w.Header().Set("Content-Type", "application/x-protobuf")
		w.Write(data)

	case "POST":
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "read error", http.StatusBadRequest)
			return
		}
		task, _, err := decodeTask(body)
		if err != nil {
			http.Error(w, "decode error: "+err.Error(), http.StatusBadRequest)
			return
		}
		task.ID = int(nextID.Add(1)) - 1
		mu.Lock()
		tasks = append(tasks, task)
		mu.Unlock()

		w.Header().Set("Content-Type", "application/x-protobuf")
		w.WriteHeader(http.StatusCreated)
		w.Write(encodeTask(task))

	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func handleProtoTask(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(strings.TrimPrefix(r.URL.Path, "/proto/tasks/"), "/")
	id, err := strconv.Atoi(parts[0])
	if err != nil || id < 0 || id > math.MaxInt32 {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case "PUT":
		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "read error", http.StatusBadRequest)
			return
		}
		updated, _, err := decodeTask(body)
		if err != nil {
			http.Error(w, "decode error: "+err.Error(), http.StatusBadRequest)
			return
		}
		mu.Lock()
		for i, t := range tasks {
			if t.ID == id {
				updated.ID = id
				tasks[i] = updated
				mu.Unlock()
				w.Header().Set("Content-Type", "application/x-protobuf")
				w.Write(encodeTask(updated))
				return
			}
		}
		mu.Unlock()
		http.Error(w, "not found", http.StatusNotFound)

	case "DELETE":
		mu.Lock()
		for i, t := range tasks {
			if t.ID == id {
				tasks = append(tasks[:i], tasks[i+1:]...)
				mu.Unlock()
				w.WriteHeader(http.StatusNoContent)
				return
			}
		}
		mu.Unlock()
		http.Error(w, "not found", http.StatusNotFound)

	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

// --- JSON fallback handlers ---

func handleJSONTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	switch r.Method {
	case "GET":
		mu.RLock()
		json.NewEncoder(w).Encode(tasks)
		mu.RUnlock()
	case "POST":
		var t Task
		if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
			http.Error(w, `{"error":"invalid JSON"}`, http.StatusBadRequest)
			return
		}
		t.ID = int(nextID.Add(1)) - 1
		mu.Lock()
		tasks = append(tasks, t)
		mu.Unlock()
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(t)
	default:
		http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
	}
}

func handleJSONTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	parts := strings.Split(strings.TrimPrefix(r.URL.Path, "/api/tasks/"), "/")
	id, err := strconv.Atoi(parts[0])
	if err != nil || id < 0 || id > math.MaxInt32 {
		http.Error(w, `{"error":"invalid id"}`, http.StatusBadRequest)
		return
	}

	switch r.Method {
	case "PUT":
		var updated Task
		if err := json.NewDecoder(r.Body).Decode(&updated); err != nil {
			http.Error(w, `{"error":"invalid JSON"}`, http.StatusBadRequest)
			return
		}
		mu.Lock()
		for i, t := range tasks {
			if t.ID == id {
				updated.ID = id
				tasks[i] = updated
				mu.Unlock()
				json.NewEncoder(w).Encode(updated)
				return
			}
		}
		mu.Unlock()
		http.Error(w, `{"error":"not found"}`, http.StatusNotFound)

	case "DELETE":
		mu.Lock()
		for i, t := range tasks {
			if t.ID == id {
				tasks = append(tasks[:i], tasks[i+1:]...)
				mu.Unlock()
				w.WriteHeader(http.StatusNoContent)
				return
			}
		}
		mu.Unlock()
		http.Error(w, `{"error":"not found"}`, http.StatusNotFound)

	default:
		http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
	}
}
