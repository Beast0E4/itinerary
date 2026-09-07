# Compass — Dynamic Travel Itinerary App

A full-stack travel planning app: route-based itineraries, shared budgets, packing lists, trip collaboration, and AI-assisted trip planning.

## Stack

- **Frontend:** React (JS), Redux Toolkit, Tailwind CSS, dnd-kit, Recharts, lucide-react
- **Backend:** Spring Boot (Web, Data JPA, Security), JWT auth, MySQL
- **AI Agent:** Python (LangChain + LangGraph + Groq) — a separate service the backend calls over HTTP; no AI/LLM logic lives in the Spring backend itself

## Project structure

```
itinerary/
├── backend/                    Spring Boot API
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/com/itinerary/
│       │   │   ├── config/          CORS, Jackson, OpenAPI, AI client
│       │   │   ├── controller/      REST endpoints
│       │   │   ├── dto/
│       │   │   │   ├── request/     Inbound payload shapes
│       │   │   │   └── response/    Outbound payload shapes
│       │   │   ├── entity/          JPA entities
│       │   │   │   └── enums/
│       │   │   ├── exception/       Global error handling
│       │   │   ├── mapper/          Entity → DTO mapping
│       │   │   ├── repository/      Spring Data JPA repositories
│       │   │   ├── security/        JWT filter, auth config
│       │   │   └── service/
│       │   │       └── impl/
│       │   └── resources/
│       │       ├── application.yml
│       │       └── db/migration/    Flyway SQL migrations
│       └── test/java/com/itinerary/
│           ├── controller/
│           └── service/
│
├── frontend/                   React SPA
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── api/                 Axios client (JWT interceptor)
│       ├── app/                 Redux store setup
│       ├── components/
│       │   ├── budget/
│       │   ├── collaborators/
│       │   ├── common/          Button, Modal, Input, Badge, etc.
│       │   ├── itinerary/       DayTimeline, AiPlanModal, etc.
│       │   ├── layout/          Sidebar, Navbar, Footer
│       │   ├── packing/
│       │   └── trip/
│       ├── features/            Redux slices + API calls, one folder per domain
│       │   ├── ai/
│       │   ├── auth/
│       │   ├── budget/
│       │   ├── collaborators/
│       │   ├── expenses/
│       │   ├── itinerary/
│       │   ├── packing/
│       │   ├── trips/
│       │   └── ui/
│       ├── hooks/                useAuth, useGeolocation, useTripId, etc.
│       ├── layouts/              AuthLayout, MainLayout, TripLayout
│       ├── pages/                One file per route
│       ├── routes/               AppRoutes, ProtectedRoute, GuestRoute
│       └── utils/                Date/currency formatters, shared constants
│
└── agent/                      Python AI planning service
    ├── .venv/                   (gitignored)
    └── src/
        ├── config/               Settings, environment loading
        ├── prompts/
        │   └── templates/        Prompt templates for trip planning
        └── tools/                LangChain tool functions
```

## Setup

### 1. Backend (Spring Boot)

```bash
cd backend
```

Generate the Maven wrapper (not committed):
```bash
mvn -N wrapper:wrapper -Dmaven=3.9.9
```

Copy `.env.example` to `.env` and fill in your values:
```
DB_HOST=...
DB_PORT=...
DB_NAME=defaultdb
DB_USER=...
DB_PASSWORD=...
JWT_SECRET=<openssl rand -base64 48>
JWT_EXPIRATION_MS=86400000
AI_AGENT_URL=http://localhost:8000
```

Run it:
```bash
./mvnw spring-boot:run
```
- Flyway auto-applies migrations from `src/main/resources/db/migration` on startup.
- API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```
- Runs on `http://localhost:5173`
- `/api` requests are proxied to `http://localhost:8080` automatically (see `vite.config.js`) — no CORS config needed for local dev

### 3. AI Agent (Python)

```bash
cd agent
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
```

Create `agent/.env`:
```
GROQ_API_KEY=your-groq-api-key
PORT=8000
```

Run it (adjust to however your agent's entrypoint is set up, e.g. FastAPI/uvicorn):
```bash
uvicorn src.main:app --reload --port 8000
```
- Must expose `POST /plan`, accepting the JSON shape defined by `AiTripPlanRequest.java` and returning the shape defined by `AiTripPlanResponse.java` (see [AI contract](#ai-agent-contract) below).
- The backend's `AI_AGENT_URL` env var must point here.

**Run order:** backend → frontend → agent (or agent can start anytime before you click "Plan with AI" — the backend only calls it on demand, and gives a clear error if it's unreachable).

## Auth flow

Register or log in via `/register` / `/login`. The JWT is stored in `localStorage` and attached to every API request. A `401` response clears the session and redirects to `/login`; visiting `/login` or `/register` while already authenticated redirects straight to `/dashboard`.

## AI agent contract

**Request** (`POST {AI_AGENT_URL}/plan`, sent by Spring):
```json
{
  "startLatitude": null,
  "startLongitude": null,
  "startLocationText": "Bangalore",
  "destinations": ["Manali"],
  "budget": 50000,
  "currency": "INR",
  "preferences": "relaxed pace"
}
```
- Exactly one of (`startLatitude`+`startLongitude`) or `startLocationText` is populated, never both.
- `destinations` may be empty — that means "you choose the destination(s) within budget."

**Response** (what the agent must return):
```json
{
  "summary": "A relaxed 5-day mountain escape to Manali...",
  "destinations": [
    { "name": "Manali", "country": "India", "city": "Manali", "latitude": 32.24, "longitude": 77.19 }
  ],
  "days": [
    {
      "dayNumber": 1,
      "date": "2026-10-10",
      "title": "Arrival",
      "items": [
        {
          "itemType": "HOTEL_CHECKIN",
          "title": "Check in to hotel",
          "locationName": "Old Manali",
          "startTime": "14:00:00",
          "estimatedCost": 2000,
          "currency": "INR"
        }
      ]
    }
  ],
  "budgetSuggestion": {
    "totalBudget": 50000,
    "accommodationLimit": 15000,
    "transportLimit": 12000,
    "foodLimit": 10000,
    "activitiesLimit": 10000,
    "miscLimit": 3000
  }
}
```
`itemType` must match one of: `FLIGHT, TRAIN, BUS, CAR_RENTAL, HOTEL_CHECKIN, HOTEL_CHECKOUT, ACTIVITY, MEAL, SIGHTSEEING, MEETING, FREE_TIME, OTHER`.

Full API surface (trips, itinerary, budget, packing, collaborators, AI) is documented at `/swagger-ui.html` once the backend is running.

## Design system

The UI ("Compass") uses a single elevated dark surface system with one confident accent color, `lucide-react` icons throughout, and a route-line/waypoint motif for itineraries. Tokens live in `frontend/tailwind.config.js` and `frontend/src/index.css`.

## Notes

- Rotate any database credentials or API keys that were ever pasted into chat, a screenshot, or committed by mistake.
- `.venv/`, `node_modules/`, and `target/` are build/dependency artifacts — never commit them (already covered by `.gitignore` in each service folder).