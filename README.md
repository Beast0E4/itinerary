# Atlas — Dynamic Travel Itinerary App

A full-stack travel planning app: route-based itineraries, shared budgets,
packing lists, and trip collaboration.

## Stack
- **Frontend:** React (JS), Redux Toolkit, Tailwind CSS, dnd-kit, Recharts
- **Backend:** Spring Boot (Web, Data JPA, Security), JWT auth
- **Database:** MySQL (tested against Aiven-hosted MySQL)

## Project structure
```
itinerary-backend/    Spring Boot API
itinerary-frontend/   React SPA
```

## Backend setup

1. `cd itinerary-backend`
2. Copy `.env.example` to `.env` and fill in your MySQL + JWT values:
   ```
   DB_HOST=...
   DB_PORT=...
   DB_NAME=defaultdb
   DB_USER=...
   DB_PASSWORD=...
   JWT_SECRET=<openssl rand -base64 48>
   ```
3. `./mvnw spring-boot:run`
   - Flyway runs the migrations in `src/main/resources/db/migration` automatically on startup.
   - API listens on `http://localhost:8080`, Swagger UI at `/swagger-ui.html`.

## Frontend setup

1. `cd itinerary-frontend`
2. `npm install`
3. `npm run dev`
   - Runs on `http://localhost:5173`, proxies `/api` to the backend (see `vite.config.js`).

## Auth flow
Register or log in via `/register` / `/login`. The JWT is stored in
`localStorage` and attached to every API request; a 401 response clears it
and redirects to `/login`.

## Design system
The UI ("Atlas") is built around travel-document vernacular — boarding-pass
trip cards, a passport-stub nav rail, and itineraries rendered as a route
line with waypoint markers rather than plain stacked cards. Tokens live in
`tailwind.config.js` and `src/index.css`.

## API surface

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, get JWT |
| GET/POST | `/api/trips` | List / create trips |
| GET/PATCH/DELETE | `/api/trips/{id}` | Trip detail, update, delete |
| GET | `/api/trips/{id}/itinerary` | Full day-by-day itinerary |
| POST | `/api/trips/{id}/itinerary/days/generate` | Generate day rows from trip date range |
| POST/PUT/DELETE | `/api/trips/{id}/itinerary/items/{itemId}` | Manage timeline items |
| PATCH | `/api/trips/{id}/itinerary/days/{dayId}/reorder` | Drag-drop reordering |
| GET/POST/PUT/DELETE | `/api/trips/{id}/expenses` | Expense tracking |
| GET/PUT | `/api/trips/{id}/budget` | Budget & spend breakdown |
| GET/POST/PATCH/DELETE | `/api/trips/{id}/packing-list` | Packing checklist |
| GET/POST/DELETE | `/api/trips/{id}/collaborators` | Sharing/permissions |
| GET/POST/DELETE | `/api/trips/{id}/documents` | Travel docs |

## Notes
- The AI agent that will interact with this system is being built separately
  in Python and is out of scope for this codebase.
- Rotate any database credentials that were ever pasted into a chat, screenshot,
  or committed by mistake.