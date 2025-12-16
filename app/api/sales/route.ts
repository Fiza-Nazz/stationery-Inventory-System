import { NextResponse } from "next/server";
import Sale from "@/models/Sales";
import Product from "@/models/Product";
import connectDB from "@/lib/db";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    const { items, paymentMethod } = data;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Calculate subtotal, tax, discount, total, profit
    let subtotal = 0;
    let totalProfit = 0;

    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for ${product.name}` }, { status: 400 });
      }

      // Reduce product stock
      product.stock -= item.quantity;
      await product.save();

      // Calculate subtotal and profit
      subtotal += item.price * item.quantity;
      totalProfit += (item.price - product.costPrice) * item.quantity;
    }

    const tax = subtotal * 0.1; // example 10% tax
    const discount = 0; // future feature
    const totalAmount = subtotal + tax - discount;

    const newSale = await Sale.create({
      items,
      subtotal,
      tax,
      discount,
      totalAmount,
      totalProfit,
      paymentMethod,
    });

    return NextResponse.json({ message: "Sale created successfully", sale: newSale, calculatedProfit: newSale.totalProfit });
  } catch (err: any) {
    console.error(err);
    if (err instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(err.errors).map((error: any) => error.message);
      return NextResponse.json(
        { message: "Validation Error", errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
