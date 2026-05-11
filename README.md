# Calculator

A modern, responsive calculator application built with a **React (TypeScript)** frontend and a **Go** backend microservice. Features a clean Windows Calculator-inspired UI, REST API integration, and containerized deployment.

---

##  Setup Instructions

### Prerequisites
- Node.js 18+ & npm
- Go 1.22+
- Docker & Docker Compose (optional)

###  Clone & Navigate
```bash
git clone <your-repo-url>
cd calculator-fullstack

---

###  Install Dependencies

# Frontend
cd frontend
npm install

# Backend
cd ../backend
go mod download
cd ..

##  How to Run the Frontend and Backend
## I recommend using docker 

Run: 
## On the root folder
 docker compose up --build
## And when the process finishes run
##For the backend:
docker compose up -d backend 
##For the frontend
cd ./frontend
npm run dev

Examples of API Calls (REST)
Endpoint: POST /api/v1/calculate
Content-Type: application/json

Success Example (Addition)

curl -X POST http://localhost:8080/api/v1/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"add","a":12.5,"b":7.5}'

Response: {"result": 20}

Error Example (Division by Zero)

curl -X POST http://localhost:8080/api/v1/calculate \
  -H "Content-Type: application/json" \
  -d '{"operation":"div","a":10,"b":0}'

Response: {"error": "Division by zero"}

Supported Operations
Operation    -      Key            -          Description
   add               +                          Addition
   sub               -                         Subtraction
   mul               ×                         Multiplication
   div               ÷                          Division
   pow               ^                         Exponentiation
   sqrt              √                         Square Root
   pct               %                          Percentage

Design Decisions & Assumptions
Single Unified Endpoint:
A single POST /api/v1/calculate endpoint with an operation field was chosen over multiple REST routes. This simplifies routing, keeps validation logic centralized, and makes future operation additions trivial.
Server-Side Validation:
All edge cases (division by zero, negative square roots, malformed JSON, unsupported operations) are strictly validated on the backend. The frontend performs lightweight numeric checks to reduce unnecessary network requests.
Vite Development Proxy:
During local development, Vite proxies /api calls to http://localhost:8080. This eliminates CORS headaches without requiring backend CORS configuration in dev mode. In production, the nginx container handles request routing.
Stateless Architecture:
The backend maintains zero session state. Each request is independent, making the service horizontally scalable, cache-friendly, and easy to containerize.
UI/UX Approach:
The frontend replicates the Windows Standard Calculator layout for instant familiarity. CSS Grid ensures pixel-perfect alignment and responsive scaling across devices.
Error Contract:
API errors return HTTP 400 Bad Request with a consistent JSON payload: {"error": "human-readable message"}. The frontend renders these inline without breaking the calculator state.

Testing (Optional)
# Backend
cd backend && go test -v -coverprofile=coverage.out ./...

# Frontend
cd frontend && npm run test