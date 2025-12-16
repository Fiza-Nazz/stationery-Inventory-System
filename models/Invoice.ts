import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: Number,
  customerName: String,
  items: [{ name: String, quantity: Number, price: Number }],
  totalAmount: Number,
  totalProfit: Number
}, { timestamps: true });

export default mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
