import { env } from "./common/utils/env";
import { app, logger } from "./server";
import connectDB from "./common/utils/database";

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(env.PORT, () => {
      logger.info(
        `Server (${env.NODE_ENV}) running at http://${env.HOST}:${env.PORT}`
      );
    });

    const shutdown = () => {
      logger.info("Shutting down server...");
      server.close(() => {
        logger.info("Server closed");
        process.exit(0);
      });

      setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    logger.error("Failed to start server", err);
    process.exit(1);
  }
};

startServer();
