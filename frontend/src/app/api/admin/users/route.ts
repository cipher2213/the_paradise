import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET() {
  await connectToDatabase();
  const users = await User.find().sort({ createdAt: -1 });
  const usersWithOrders = await Promise.all(
    users.map(async (user) => {
      const orders = await Order.find({ userEmail: user.email }).sort({ orderTime: -1 });
      const totalSpent = orders
        .filter((order) => order.status === "completed")
        .reduce((sum, order) => sum + (order.total || 0), 0);
      return {
        ...user.toObject(),
        orders,
        totalSpent,
      };
    })
  );
  return NextResponse.json({ users: usersWithOrders });
} 