import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  image: String,
  phone: String,
});

export default models.User || model("User", UserSchema); 