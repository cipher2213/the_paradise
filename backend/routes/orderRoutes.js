// routes/orderRoutes.js
import express from 'express';
import Order from '../models/order.js';
import { getOrderById, getOrderByTableId } from '../controller/orderController.js';

const router = express.Router();

router.post('/place', async (req, res) => {
  try {
    const { tableId, customerName, phoneNumber, userEmail, items, total, orderTime } = req.body;

    const order = new Order({
      tableId,
      customerName,
      phoneNumber,
      userEmail,
      items,
      total,
      orderTime,
    });

    await order.save();

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
  
});

router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderTime: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/user/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const orders = await Order.find({ userEmail: email }).sort({ orderTime: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Get order by ID
router.get('/:id', getOrderById);
router.get('/table/:tableId', getOrderByTableId);


  // Update status of an order
router.put('/:id/status', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});

  
  router.put('/update/:id', async (req, res) => {
    try {
      const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });
  
      res.json({ success: true, order: updated });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  // GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderTime: -1 }); // Latest first
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


  router.delete('/delete/:id', async (req, res) => {
    try {
      const deleted = await Order.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Order not found' });
  
      res.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

export default router;
