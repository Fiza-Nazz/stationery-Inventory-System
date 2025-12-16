import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const product = await Product.findById(params.id);
  return NextResponse.json(product);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const data = await req.json();
  const product = await Product.findByIdAndUpdate(params.id, data, { new: true });
  return NextResponse.json(product);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Product deleted successfully!" });
}
