from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.order_routes import router as order_router 
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Order Service",
    description="Handles all order operations",
    version="1.0.0"
)

# Allow requests from other services/frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "order-service"
    }

# Register routes
app.include_router(
    order_router,
    prefix="/api/orders",
    tags=["orders"]
)

# Start server
if __name__ == "__main__":
    import uvicorn
    PORT = int(os.getenv("PORT", 3002))
    print(f"🚀 Order Service running on http://localhost:{PORT}")
    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)