Hi,

I’m facing a persistent issue with my Next.js + Mongoose project. My API routes (/api/products and /api/dashboard) are failing with the following error:

MongoParseError: options usenewurlparser, useunifiedtopology are not supported


Details:

Mongoose version: 9.0.1

Node.js version: 18+

The error occurs when calling mongoose.connect(MONGODB_URI) in lib/db.ts.

It breaks all database operations, returning 500 Internal Server Error on API calls.

This seems to be caused by legacy options (useNewUrlParser, useUnifiedTopology) being either explicitly or implicitly used.

Current lib/db.ts:

import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };
if (!(global as any).mongoose) (global as any).mongoose = cached;

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;


Request:
Please help me update the database connection code and API routes so that:

The MongoDB connection works without MongoParseError.

The /api/products route successfully returns all products in JSON.

The /api/dashboard route works correctly.

Thank you!