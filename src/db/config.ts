declare var global:any
import mongoose from "mongoose";

const DATABASE_URL = process.env.MONGODB_DATABASE_URI as string

if (!DATABASE_URL) {
    throw new Error("Please define the DATABASE_URL environment variable inside .env.local");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        console.log('Connected to Mongo✅ : Cached')
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(DATABASE_URL, {
            bufferCommands: false,
        })
            .then((mongoose) => {
                console.log('Connected to Mongo✅')
                return mongoose;
            });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDB;