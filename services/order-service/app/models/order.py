from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

# Order status options
class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

# Single item in an order
class OrderItem(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    price: float

    @property
    def subtotal(self):
        return self.quantity * self.price

# Address model
class Address(BaseModel):
    street: str
    city: str
    state: str
    zip_code: str
    country: str = "US"

# Create order request (what user sends)
class CreateOrderRequest(BaseModel):
    items: List[dict]       # [{ product_id: 1, quantity: 2 }]
    shipping_address: Address
    notes: Optional[str] = None

# Full order (what's saved in database)
class Order(BaseModel):
    user_id: int
    items: List[OrderItem]
    shipping_address: Address
    status: OrderStatus = OrderStatus.PENDING
    total_amount: float
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
