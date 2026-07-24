import mongoose from "mongoose";

const mongodbUrl = process.env.MONGODB_URI;

if (!mongodbUrl) {
  throw new Error("db error!");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongodbUrl).then((c) => c.connection);
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
