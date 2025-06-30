"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Chip,
  IconButton,
} from "@material-tailwind/react";
import { FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  tableId: string;
  customerName: string;
  phoneNumber: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: "pending" | "completed" | "cancelled";
  orderTime: string;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      toast.success("Order status updated");
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 2000); // fetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "blue-gray";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h3" color="blue-gray">
          Orders Management
        </Typography>
        <IconButton variant="text" onClick={fetchOrders}>
          <FiRefreshCw className="h-4 w-4" />
        </IconButton>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading orders...</div>
      ) : orders.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <Typography variant="h6" color="blue-gray">
              No orders found
            </Typography>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <CardBody>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Typography variant="h6" color="blue-gray">
                      Order #{order._id.slice(-6)}
                    </Typography>
                    <Typography color="gray" className="text-sm">
                      {formatDate(order.orderTime)}
                    </Typography>
                  </div>
                  <Chip
                    color={getStatusColor(order.status)}
                    value={order.status}
                    className="capitalize"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                      Customer Details
                    </Typography>
                    <Typography color="gray" className="text-sm">
                      Name: {order.customerName}
                    </Typography>
                    <Typography color="gray" className="text-sm">
                      Phone: {order.phoneNumber}
                    </Typography>
                    <Typography color="gray" className="text-sm">
                      Table: {order.tableId}
                    </Typography>
                  </div>

                  <div>
                    <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                      Order Items
                    </Typography>
                    {order.items.map((item, index) => (
                      <Typography key={index} color="gray" className="text-sm">
                        {item.quantity}x {item.name} - ₹{item.price * item.quantity}
                      </Typography>
                    ))}
                    <Typography variant="h6" color="blue" className="mt-2">
                      Total: ₹{order.total}
                    </Typography>
                  </div>
                </div>

                {order.status === "pending" && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      color="green"
                      size="sm"
                      onClick={() => updateOrderStatus(order._id, "completed")}
                    >
                      Complete Order
                    </Button>
                    <Button
                      color="red"
                      size="sm"
                      variant="outlined"
                      onClick={() => updateOrderStatus(order._id, "cancelled")}
                    >
                      Cancel Order
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 