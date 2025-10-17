import aj from "../lib/arcjet";
import { isSpoofedBot } from "@arcjet/inspect";
import { Request, Response, NextFunction } from "express";

export const arcjetProtection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
        if (decision.reason.isRateLimit()) {
            return res.status(429).json({ message: "Too many requests. Please try again later." });
        } else if (decision.reason.isBot()) {
            return res.status(403).json({ message: "Bot access denied." });
        } else {
            return res.status(403).json({ message: "Access denied by security policy." });
        }
    }

    // Check for spoofed bots
    if (decision.results.some(isSpoofedBot)) {
        return res.status(403).json({ error: "spoofed_bot detected", message: "Access denied: Malicious bot activity detected." });
    }

    next();
  } catch (error) {
    console.error("Arcjet Protection Error:", error);
    next();
  }
};
