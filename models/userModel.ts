import mongoose, { Document, Schema } from "mongoose";

export interface IGrade {
    subject: string;  
    score: number; 
    commant: string;  
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    grades?: IGrade[];  
    role: "teacher" | "student";
    className : string;
    classId? : Schema.Types.ObjectId;
}

const userSchema: Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true, 
        match: [/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/, "please provide valid email"],
    },
    password: {
        type: String,
        required: true,
        unique: true,
        match : [/^[0-8]{8}$/, "password must be 8 digits"],
    },
    grades: {
        type: [{
            subject: {
                type: String,
                required: [true, "Please provide subject name"],
            },
            score: {
                type: Number,
                required: [true, "Please provide score"],
            },
            commant: {
                type: String,
                required: [true, "Please provide commant"],
            },
        }],
    
    },
    role: {
        type: String,
        enum: ["teacher", "student"],
        required: true, 
    },
    className: {
        type: String,
        required: [true,'Please provide class name'],
    },
    classId: {
        type: Schema.Types.ObjectId,
        ref: "Class",
        required: true,    
    }
});

export default mongoose.model<IUser>("User", userSchema);
