"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, Typography, Avatar, Button } from "@material-tailwind/react";

interface Order {
  _id: string;
  items: { name: string; quantity: number; price: string }[];
  total: number;
  status: string;
  orderTime: string;
}

interface User {
  _id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt?: string;
  totalSpent?: number;
  orders?: Order[];
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        console.log('Fetched users:', data.users);
        setUsers(data.users || []);
      } catch (err) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Typography variant="h3" color="blue-gray" className="mb-6">
        Registered Users
      </Typography>
      {loading ? (
        <div>Loading users...</div>
      ) : users.length === 0 ? (
        <Card><CardBody>No users found.</CardBody></Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Avatar</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Signup Date</th>
                <th className="py-2 px-4 border-b">Total Spent</th>
                <th className="py-2 px-4 border-b">Order History</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <>
                  <tr key={user._id}>
                    <td className="py-2 px-4 border-b text-center">
                      {user.image ? (
                        <Avatar src={user.image} alt={user.name || user.email} size="sm" />
                      ) : (
                        <Avatar size="sm" />
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">{user.name || "-"}</td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">{user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}</td>
                    <td className="py-2 px-4 border-b">₹{user.totalSpent ?? 0}</td>
                    <td className="py-2 px-4 border-b">
                      <Button size="sm" onClick={() => setExpanded(expanded === user._id ? null : user._id)}>
                        {expanded === user._id ? "Hide" : "View"}
                      </Button>
                    </td>
                  </tr>
                  {expanded === user._id && user.orders && (
                    <tr>
                      <td colSpan={6} className="bg-gray-50">
                        <div className="p-4">
                          <Typography variant="h6" color="blue-gray" className="mb-2">
                            Order History
                          </Typography>
                          {user.orders.length === 0 ? (
                            <div>No orders found.</div>
                          ) : (
                            <table className="min-w-full bg-white border">
                              <thead>
                                <tr>
                                  <th className="py-1 px-2 border-b">Order ID</th>
                                  <th className="py-1 px-2 border-b">Date</th>
                                  <th className="py-1 px-2 border-b">Status</th>
                                  <th className="py-1 px-2 border-b">Items</th>
                                  <th className="py-1 px-2 border-b">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {user.orders.map((order) => (
                                  <tr key={order._id}>
                                    <td className="py-1 px-2 border-b">{order._id.slice(-6)}</td>
                                    <td className="py-1 px-2 border-b">{new Date(order.orderTime).toLocaleString()}</td>
                                    <td className="py-1 px-2 border-b capitalize" style={{ color: order.status === 'completed' ? 'green' : order.status === 'cancelled' ? 'red' : undefined }}>
                                      {order.status}
                                    </td>
                                    <td className="py-1 px-2 border-b">
                                      {order.items.map((item, idx) => (
                                        <div key={idx}>
                                          {item.quantity}x {item.name}
                                        </div>
                                      ))}
                                    </td>
                                    <td className="py-1 px-2 border-b">₹{order.total}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 