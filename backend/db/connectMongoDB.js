import mongoose from "mongoose";

export default async function connectMongoDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      // Connection options for better performance and reliability
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log("✅ MongoDB Connected Successfully!");
    console.log(`📍 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);

    // Graceful degradation: only exit in development, log in production
    if (process.env.NODE_ENV === "development") {
      process.exit(1); // for dev, fail fast
    } else {
      console.warn("⚠️ Continuing without MongoDB connection in production.");
    }
  }
}
