import mongoose from "mongoose";

const SalesSchema = new mongoose.Schema({
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      quantity: { type: Number, default: 1 },
      price: { type: Number, default: 0 }
    }
  ],
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ["Cash", "Card"], default: "Cash" }
}, { timestamps: true });

export default mongoose.models.Sales || mongoose.model("Sales", SalesSchema);
