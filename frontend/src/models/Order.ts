import mongoose, { Schema, models, model } from "mongoose";

const OrderSchema = new Schema({
  tableId: { type: String, required: true },
  customerName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  userEmail: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: String, required: true },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  total: { type: Number, required: true },
  orderTime: { type: Date, default: Date.now },
});

export default models.Order || model("Order", OrderSchema); 