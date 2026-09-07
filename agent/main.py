from fastapi import FastAPI
import uvicorn
from src.routes.plan import router as trip_router

app = FastAPI (title="AI Trip Planner API")

# Register the routes
app.include_router (trip_router)

if __name__ == "__main__":
    # Run the server
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)