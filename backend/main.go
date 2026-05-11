package main

import (
	"encoding/json"
	"log"
	"math"
	"net/http"
	"strings"
)

type CalcRequest struct {
	Operation string  `json:"operation"`
	A         float64 `json:"a"`
	B         float64 `json:"b"`
}

type CalcResponse struct {
	Result float64 `json:"result"`
	Error  string  `json:"error,omitempty"`
}

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next(w, r)
	}
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func calculateHandler(w http.ResponseWriter, r *http.Request) {
	var req CalcRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, CalcResponse{Error: "Invalid JSON payload"})
		return
	}

	op := strings.ToLower(strings.TrimSpace(req.Operation))
	var result float64

	switch op {
	case "add":
		result = req.A + req.B
	case "sub":
		result = req.A - req.B
	case "mul":
		result = req.A * req.B
	case "div":
		if req.B == 0 {
			writeJSON(w, http.StatusBadRequest, CalcResponse{Error: "Division by zero"})
			return
		}
		result = req.A / req.B
	case "pow":
		result = math.Pow(req.A, req.B)
	case "sqrt":
		if req.A < 0 {
			writeJSON(w, http.StatusBadRequest, CalcResponse{Error: "Square root of negative number"})
			return
		}
		result = math.Sqrt(req.A)
	case "pct":
		result = (req.A * req.B) / 100.0
	default:
		writeJSON(w, http.StatusBadRequest, CalcResponse{Error: "Unsupported operation: " + op})
		return
	}

	writeJSON(w, http.StatusOK, CalcResponse{Result: result})
}

func main() {
	http.HandleFunc("/api/v1/calculate", corsMiddleware(calculateHandler))
	log.Println("🚀 Calculator backend running on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}