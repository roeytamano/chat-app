import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ENV } from "../lib/env";
import User, { IUser } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;
        if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });
        
        const decoded = jwt.verify(token, ENV.JWT_SECRET!) as JwtPayload;
        if (!decoded || typeof decoded === 'string' || !('userId' in decoded)) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(401).json({ message: "Unauthorized - User not found" });

        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        return res.status(401).json({ message: "Unauthorized - Token failed" });
    }
}