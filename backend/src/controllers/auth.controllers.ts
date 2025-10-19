import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils";
import { sendWelcomeEmail } from "../emails/emailHandlers";
import { ENV } from "../lib/env";
import cloudinary from "../lib/cloudinary";

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
        const userEmail = await User.findOne({ email });
        if (userEmail) return res.status(400).json({ message: "Email already in use." });
        const userName = await User.findOne({ fullName });
        if (userName) return res.status(400).json({ message: "Username already in use." });

        //hash password
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
            const savedUser = await newUser.save();
            generateToken(savedUser._id.toString(), res);
            
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                password: newUser.password,
                profilePicture: newUser.profilePicture
            });
            console.log("Signup request body:", req.body);
            
            try{
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL!);
                console.log("Welcome email sent to:", savedUser.email);
            } catch (error) {
                console.error("Error sending welcome email:", error);
            }

        } else {
            return res.status(500).json({ message: "Error creating user." });
        }
    } catch (error) {
        console.log("Error in signup:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export const login = async (req: Request, res: Response) => {
   const { email, password } = req.body;

   try {
       if (!email || !password) {
           return res.status(400).json({ message: "All fields are required." });
       }

       // Check if user exists
       const user = await User.findOne({ email });
       if (!user) return res.status(400).json({ message: "Invalid credentials." }); // never reveal if email or password is incorrect

       // Check password
       const isPasswordCorrect = await bcrypt.compare(password, user.password);
       if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials." });

       // Generate token
       generateToken(user._id.toString(), res);
       res.status(200).json({
           _id: user._id,
           fullName: user.fullName,
           email: user.email,
           profilePicture: user.profilePicture
       });
   } catch (error) {
       console.log("Error in login:", error);
       return res.status(500).json({ message: "Internal server error." });
   }
}

export const logout = (_: Request, res: Response) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "User logged out successfully." });
}

export const updateProfile = async (req: Request & { user?: { _id?: string } }, res: Response) => {
    try {
        const { profilePicture } = req.body;
        if (!profilePicture) return res.status(400).json({ message: "Profile picture is required." });

        const userId = req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized." });

        const uploadResponse = await cloudinary.uploader.upload(profilePicture)
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePicture: uploadResponse.secure_url }, { new: true });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}