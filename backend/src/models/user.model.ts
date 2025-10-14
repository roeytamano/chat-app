import mongoose, { Model, Schema } from "mongoose";

export interface IUser extends Document {
    _id: string;
    fullName: string;
    email: string;
    password: string;
    profilePicture: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    fullName: { 
        type: String,
        required: true,
        unique: true
    },
    email: { 
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String,
        required: true,
        minlength: 6
    },
    profilePicture: { 
        type: String,
        default: ""
    }
}, { timestamps: true }); //CreatedAt and UpdatedAt

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;