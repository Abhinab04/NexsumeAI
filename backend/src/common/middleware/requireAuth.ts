import { type RequestHandler } from "express";
import { getAuth } from "@clerk/express";

export const requireAuth: RequestHandler = (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid or missing token" });
    }
    
    next();
  } catch (error) {
    console.error("[requireAuth] Error:", error);
    return res.status(401).json({ success: false, message: "Unauthorized: Auth error" });
  }
};
