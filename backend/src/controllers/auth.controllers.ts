import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils";

export const signup = async (req: Request, res: Response) => {
    const {fullName, email, password} = req.body;
    
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }
        
        //check if user already exists
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already in use." });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //create new user
        const newUser = new User({
            fullName, 
            email,
            password: hashedPassword,
            profilePicture: ""
        });
        if (newUser) {
            generateToken(newUser._id.toString(), res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                password: newUser.password,
                profilePicture: newUser.profilePicture
            });
            console.log("Signup request body:", req.body);
            // TODO: send welcome email
        } else {
            return res.status(500).json({ message: "Error creating user." });
        }
    } catch (error) {
        console.log("Error in signup:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export const login = (req: Request, res: Response) => {
    // login logic here
    res.send("User logged in");
}

export const logout = (req: Request, res: Response) => {
    // logout logic here
    res.send("User logged out");
}   