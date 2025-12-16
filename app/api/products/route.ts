import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose";

/* -------------------------
   GET: All Products Fetch
------------------------- */
export async function GET() {
  try {
    await connectDB(); // Database se connect karo
    const products = await Product.find(); // Sare products fetch karo
    return NextResponse.json(products, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching products:", err.message);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/* -------------------------
   POST: Add New Product
------------------------- */
export async function POST(req: Request) {
  try {
    await connectDB(); // Database se connect karo
    const body = await req.json();

    // Optional: check for duplicate product
    const existing = await Product.findOne({ name: body.name.trim() });
    if (existing) {
      return NextResponse.json({ message: "Product already exists" }, { status: 400 });
    }

    // Product create karo, Mongoose schema will handle validation
    const product = await Product.create({
      name: body.name.trim(),
      category: body.category.trim(),
      costPrice: Number(body.costPrice),
      retailPrice: Number(body.retailPrice),
      stock: Number(body.stock),
      wholesalePrice: body.wholesalePrice ? Number(body.wholesalePrice) : 0,
      unit: body.unit || "pcs"
    });

    return NextResponse.json(
      { message: "Product added successfully", product },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error adding product:", err.message);
    if (err instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(err.errors).map((error: any) => error.message);
      return NextResponse.json(
        { message: "Validation Error", errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Something went wrong while adding product" },
      { status: 500 }
    );
  }
}

