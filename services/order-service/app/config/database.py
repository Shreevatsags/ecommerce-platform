from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

# MongoDB connection URL
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")

# Create client
client = AsyncIOMotorClient(MONGODB_URL)

# Get database
database = client.orders_db

# Get collection (like a table in PostgreSQL)
orders_collection = database.orders

print("✅ Connected to MongoDB")
