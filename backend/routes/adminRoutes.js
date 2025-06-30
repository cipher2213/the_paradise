import express from 'express';
import Order from '../models/order.js';
import User from '../models/User.js';
import Visitor from '../models/visitor.js';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const orders = await Order.find();
    const users = await User.find();
    const visitorData = await Visitor.findOne(); // ✅ Fetch visitor doc

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const revenue = orders
  .filter(o => o.status !== 'cancelled') // Exclude cancelled orders
  .reduce((sum, o) => sum + (o.total || 0), 0);
 // ✅ Prevent NaN
    const activeUsers = users.length;
    const visitorCount = visitorData?.count || 0;

    res.json({
      totalOrders,
      pendingOrders,
      revenue,
      activeUsers,
      visitorCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
});

export default router;
