// /app/api/test-db/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ success: true, message: "Database connected successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
