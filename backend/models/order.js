import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  tableId: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  phoneNumber: {                            // ✅ Ensure phone number is required
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true
  },
  
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: String,
        required: true,
      },
      
      
    },
  ],

  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
  total: {
    type: Number,
    required: true,
  },
  orderTime: {
    type: Date,
    default: Date.now,
  },
});

// Avoid model overwrite error in development
export default mongoose.models.Order || mongoose.model('Order', orderSchema);
