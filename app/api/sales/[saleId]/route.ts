import { NextResponse } from "next/server";
import Sale from "@/models/Sales";
import connectDB from "@/lib/db";

connectDB();

export async function GET(req: Request, { params }: { params: { saleId: string } }) {
  try {
    const sale = await Sale.findById(params.saleId);
    if (!sale) return NextResponse.json({ error: "Sale not found" }, { status: 404 });
    return NextResponse.json(sale);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
