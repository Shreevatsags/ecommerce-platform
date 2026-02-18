from fastapi import APIRouter, HTTPException, Depends
from app.controllers.order_controller import order_controller
from app.models.order import CreateOrderRequest
from app.middleware.auth import verify_token

router = APIRouter()

# POST /api/orders - Create new order
@router.post("/")
async def create_order(
    order_data: CreateOrderRequest,
    current_user = Depends(verify_token)  # Must be logged in!
):
    try:
        order = await order_controller.create_order(
            user_id=current_user["userId"],
            order_data=order_data
        )
        return {
            "success": True,
            "message": "Order created successfully!",
            "data": order
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# GET /api/orders - Get all my orders
@router.get("/")
async def get_my_orders(current_user = Depends(verify_token)):
    try:
        orders = await order_controller.get_user_orders(
            user_id=current_user["userId"]
        )
        return {
            "success": True,
            "count": len(orders),
            "data": orders
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET /api/orders/{order_id} - Get single order
@router.get("/{order_id}")
async def get_order(
    order_id: str,
    current_user = Depends(verify_token)
):
    try:
        order = await order_controller.get_order_by_id(
            order_id=order_id,
            user_id=current_user["userId"]
        )

        if not order:
            raise HTTPException(
                status_code=404,
                detail="Order not found"
            )

        return {
            "success": True,
            "data": order
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# PUT /api/orders/{order_id}/cancel - Cancel an order
@router.put("/{order_id}/cancel")
async def cancel_order(
    order_id: str,
    current_user = Depends(verify_token)
):
    try:
        order, error = await order_controller.cancel_order(
            order_id=order_id,
            user_id=current_user["userId"]
        )

        if error:
            raise HTTPException(status_code=400, detail=error)

        return {
            "success": True,
            "message": "Order cancelled successfully",
            "data": order
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))