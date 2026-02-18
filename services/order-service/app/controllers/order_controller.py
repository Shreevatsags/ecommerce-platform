from app.config.database import orders_collection
from app.models.order import Order, OrderItem, OrderStatus, CreateOrderRequest
from datetime import datetime
from bson import ObjectId
import httpx
import os

PRODUCT_SERVICE_URL = os.getenv("PRODUCT_SERVICE_URL", "http://localhost:3001")

class OrderController:

    # Create new order
    async def create_order(self, user_id: int, order_data: CreateOrderRequest):
        try:
            # Step 1: Validate products and get prices
            order_items = []
            total_amount = 0

            for item in order_data.items:
                product_id = item["product_id"]
                quantity = item["quantity"]

                # Ask Product Service for product details
                async with httpx.AsyncClient() as client:
                    response = await client.get(
                        f"{PRODUCT_SERVICE_URL}/api/products/{product_id}"
                    )

                # Product not found
                if response.status_code != 200:
                    raise Exception(f"Product {product_id} not found")

                product = response.json()["data"]

                # Check if enough stock
                if product["stock"] < quantity:
                    raise Exception(
                        f"Not enough stock for {product['name']}. "
                        f"Available: {product['stock']}, Requested: {quantity}"
                    )

                # Add to order items
                order_item = OrderItem(
                    product_id=product_id,
                    product_name=product["name"],
                    quantity=quantity,
                    price=float(product["price"])
                )
                order_items.append(order_item)

                # Add to total
                total_amount += float(product["price"]) * quantity

            # Step 2: Create order object
            new_order = Order(
                user_id=user_id,
                items=order_items,
                shipping_address=order_data.shipping_address,
                total_amount=round(total_amount, 2),
                notes=order_data.notes
            )

            # Step 3: Save to MongoDB
            order_dict = new_order.dict()
            result = await orders_collection.insert_one(order_dict)

            # Step 4: Return created order
            created_order = await orders_collection.find_one(
                {"_id": result.inserted_id}
            )

            return self._format_order(created_order)

        except Exception as error:
            raise Exception(str(error))

    # Get all orders for a user
    async def get_user_orders(self, user_id: int):
        try:
            cursor = orders_collection.find(
                {"user_id": user_id}
            ).sort("created_at", -1)

            orders = []
            async for order in cursor:
                orders.append(self._format_order(order))

            return orders

        except Exception as error:
            raise Exception(str(error))

    # Get single order by ID
    async def get_order_by_id(self, order_id: str, user_id: int):
        try:
            order = await orders_collection.find_one({
                "_id": ObjectId(order_id),
                "user_id": user_id
            })

            if not order:
                return None

            return self._format_order(order)

        except Exception as error:
            raise Exception(str(error))

    # Cancel an order
    async def cancel_order(self, order_id: str, user_id: int):
        try:
            # Find the order
            order = await orders_collection.find_one({
                "_id": ObjectId(order_id),
                "user_id": user_id
            })

            if not order:
                return None, "Order not found"

            # Can only cancel PENDING or CONFIRMED orders
            if order["status"] not in ["pending", "confirmed"]:
                return None, f"Cannot cancel order with status: {order['status']}"

            # Update status to cancelled
            await orders_collection.update_one(
                {"_id": ObjectId(order_id)},
                {
                    "$set": {
                        "status": "cancelled",
                        "updated_at": datetime.now()
                    }
                }
            )

            updated_order = await orders_collection.find_one(
                {"_id": ObjectId(order_id)}
            )

            return self._format_order(updated_order), None

        except Exception as error:
            raise Exception(str(error))

    # Update order status (admin only)
    async def update_order_status(self, order_id: str, new_status: str):
        try:
            result = await orders_collection.update_one(
                {"_id": ObjectId(order_id)},
                {
                    "$set": {
                        "status": new_status,
                        "updated_at": datetime.now()
                    }
                }
            )

            if result.modified_count == 0:
                return None

            updated = await orders_collection.find_one(
                {"_id": ObjectId(order_id)}
            )

            return self._format_order(updated)

        except Exception as error:
            raise Exception(str(error))

    # Format order for response (convert MongoDB _id to string)
    def _format_order(self, order):
        if order:
            order["id"] = str(order["_id"])
            del order["_id"]
        return order

# Single instance
order_controller = OrderController()