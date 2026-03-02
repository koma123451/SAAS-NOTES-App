import mongoose from "mongoose";

export const connectDB = async (uri?: string) => {
  try {
    // 优先使用传入的 uri（用于测试）
    const mongoUri = uri || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(mongoUri);

    if (process.env.NODE_ENV !== "test") {
      console.log("✅ MongoDB connected");
    }

  } catch (error) {
    console.error("❌ MongoDB connection error:", error);

    // 测试环境不要直接退出
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }

    throw error;
  }
};