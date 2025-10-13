import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (userId: string, res: Response) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET || "defaultsecret", { expiresIn: "7d" });
    res.cookie("jwt", token, {
        httpOnly: true, // prevent client-side JS from reading the cookie and helps prevent XSS attacks,
        sameSite: "strict", // CSRF protection
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
    });
    
    return token;
}