package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCalculateHandler(t *testing.T) {
	tests := []struct {
		name    string
		payload CalcRequest
		status  int
		result  float64
		errMsg  string
	}{
		{"addition", CalcRequest{"add", 5, 3}, 200, 8, ""},
		{"division by zero", CalcRequest{"div", 10, 0}, 400, 0, "Division by zero"},
		{"sqrt negative", CalcRequest{"sqrt", -4, 0}, 400, 0, "Square root of negative number"},
		{"exponent", CalcRequest{"pow", 2, 3}, 200, 8, ""},
		{"percentage", CalcRequest{"pct", 200, 15}, 200, 30, ""},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			body, _ := json.Marshal(tt.payload)
			req := httptest.NewRequest(http.MethodPost, "/api/v1/calculate", bytes.NewReader(body))
			req.Header.Set("Content-Type", "application/json")
			rr := httptest.NewRecorder()

			calculateHandler(rr, req)

			if rr.Code != tt.status {
				t.Errorf("status: got %d, want %d", rr.Code, tt.status)
			}

			var res CalcResponse
			json.NewDecoder(rr.Body).Decode(&res)
			if tt.errMsg != "" {
				if res.Error != tt.errMsg {
					t.Errorf("error: got %q, want %q", res.Error, tt.errMsg)
				}
			} else {
				if res.Result != tt.result {
					t.Errorf("result: got %f, want %f", res.Result, tt.result)
				}
			}
		})
	}
}