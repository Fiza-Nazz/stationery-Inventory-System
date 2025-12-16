import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const data = await req.json();

    // Validate incoming data for updates
    if (data.costPrice !== undefined && (typeof data.costPrice !== "number" || data.costPrice < 0)) {
      return NextResponse.json({ message: "Invalid costPrice provided. Must be a non-negative number." }, { status: 400 });
    }
    if (data.retailPrice !== undefined && (typeof data.retailPrice !== "number" || data.retailPrice < 0)) {
      return NextResponse.json({ message: "Invalid retailPrice provided. Must be a non-negative number." }, { status: 400 });
    }
    if (data.stock !== undefined && (typeof data.stock !== "number" || data.stock < 0)) {
      return NextResponse.json({ message: "Invalid stock provided. Must be a non-negative number." }, { status: 400 });
    }
    if (data.wholesalePrice !== undefined && (typeof data.wholesalePrice !== "number" || data.wholesalePrice < 0)) {
      return NextResponse.json({ message: "Invalid wholesalePrice provided. Must be a non-negative number." }, { status: 400 });
    }
    if (data.name !== undefined && (typeof data.name !== "string" || data.name.trim() === "")) {
      return NextResponse.json({ message: "Invalid product name provided." }, { status: 400 });
    }
    if (data.category !== undefined && (typeof data.category !== "string" || data.category.trim() === "")) {
      return NextResponse.json({ message: "Invalid category provided." }, { status: 400 });
    }
    if (data.unit !== undefined && (typeof data.unit !== "string" || data.unit.trim() === "")) {
      return NextResponse.json({ message: "Invalid unit provided." }, { status: 400 });
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ message: "Request body cannot be empty" }, { status: 400 });
    }

    const product = await Product.findByIdAndUpdate(params.id, data, { new: true, runValidators: true });
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
