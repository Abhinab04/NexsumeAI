import { env } from "./common/utils/env.js";
import { app, logger } from "./server.js";
import connectDB from "./common/utils/database.js";

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(
      env.PORT,
      "0.0.0.0",
      () => {
        logger.info(
          `Server (${env.NODE_ENV}) running on port http://${env.HOST}:${env.PORT}`,
        );
      },
    );

    const onCloseSignal = () => {
      logger.info("SIGINT/SIGTERM received, shutting down");

      server.close(() => {
        logger.info("Server closed");
        process.exit(0);
      });

      setTimeout(() => {
        process.exit(1);
      }, 10000).unref();
    };

    process.on("SIGINT", onCloseSignal);
    process.on("SIGTERM", onCloseSignal);
  } catch (err: unknown) {
    logger.error(
      {
        err,
      },
      "Failed to start server",
    );

    process.exit(1);
  }
};

startServer();
