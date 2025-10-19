import { Request, Response } from "express";
import cloudinary from "../lib/cloudinary.js";
// import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model";


export const getAllContacts = async (req: Request & { user?: { _id?: string } }, res: Response) => {
  try {
    const loggedInUserId = req.user!._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByUserId = async (req: Request & { user?: { _id?: string } }, res: Response) => {
    try {
        const myId = req.user!._id;
        const {id} = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: id },
                { senderId: id, receiverId: myId }
            ]
        }).sort({ createdAt: 1 }); // sort by createdAt in ascending order
        
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessagesByUserId:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const sendMessage = async (req: Request & { user?: { _id?: string } }, res: Response) => {
    try {
        const senderId = req.user!._id;
        const {id: receiverId} = req.params;
        const { text, image } = req.body;
        
        let imageUrl = "";
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);

    } catch (error) {
        console.log("Error in sendMessage:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getChatPartners = async (req: Request & { user?: { _id?: string } }, res: Response) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const myId = req.user._id;

        // Find distinct user IDs who have chatted with the logged-in user
        const messages = await Message.find({ $or: [{ senderId: myId }, { receiverId: myId }] });

        const partnerIdsSet = [
            ...new Set(messages.map((msg) =>
                msg.senderId.toString() === myId.toString() ? msg.receiverId.toString() : msg.senderId.toString()
            ))
        ];

        const chatPartners = await User.find({ _id: { $in: partnerIdsSet } }).select("-password");
        res.status(200).json(chatPartners);
    } catch (error) {
        console.log("Error in getChatPartners:", error);
        res.status(500).json({ message: "Server error" });
    }
}