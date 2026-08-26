import type { ErrorRequestHandler, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

const unexpectedRequest: RequestHandler = (_req, res) => {
  res.status(StatusCodes.NOT_FOUND).send("Not Found");
};

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
  console.error("\n========== GLOBAL ERROR HANDLER ==========");
  console.error(err);
  console.error("==========================================\n");
  res.locals.err = err;
  next(err);
};

export default (): [RequestHandler, ErrorRequestHandler] => [
  unexpectedRequest,
  addErrorToRequestLog,
];
