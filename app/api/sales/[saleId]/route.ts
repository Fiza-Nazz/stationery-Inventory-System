import { NextResponse } from "next/server";
import Sale from "@/models/Sales";
import Product from "@/models/Product"; // Import Product model
import connectDB from "@/lib/db";

export async function GET(req: Request, { params }: { params: { saleId: string } }) {
  try {
    await connectDB();
    const sale = await Sale.findById(params.saleId); // Fetch directly from DB
    if (!sale) return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    return NextResponse.json(sale);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
