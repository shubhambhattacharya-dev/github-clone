import mongoose from "mongoose";

export default async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);

    // Graceful degradation: only exit in development, log in production
    if (process.env.NODE_ENV === "development") {
      process.exit(1); // for dev, fail fast
    } else {
      console.warn("⚠️ Continuing without MongoDB connection in production.");
      // Optionally implement retry logic here
    }
  }
}
