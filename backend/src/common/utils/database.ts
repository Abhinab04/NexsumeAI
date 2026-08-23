import mongoose from "mongoose";
import { env } from "@/common/utils/env";
import { logger } from "@/server.js";

export default async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(env.MONGODB_URI);
    logger.info(
      `✅ MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (err) {
    logger.error(`❌ MongoDB Connection Error : ${err}`);
    process.exit(1);
  }
}
