import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  costPrice: { type: Number, required: true },
  retailPrice: { type: Number, required: true },
  wholesalePrice: { type: Number, required: true },
  stock: { type: Number, required: true },
  unit: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
