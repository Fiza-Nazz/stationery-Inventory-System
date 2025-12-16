import mongoose from "mongoose";

interface IInvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export interface IInvoice extends mongoose.Document {
  invoiceNumber: number;
  customerName: string;
  items: IInvoiceItem[];
  totalAmount: number;
  totalProfit?: number; // Optional as per schema
}

const InvoiceSchema = new mongoose.Schema<IInvoice>({
  invoiceNumber: { type: Number, required: true },
  customerName: { type: String, required: true },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  totalProfit: Number
}, { timestamps: true });

export default mongoose.models.Invoice as mongoose.Model<IInvoice> || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
