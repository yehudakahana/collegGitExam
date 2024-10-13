import userModel from "../models/userModel.js";
import classModel from "../models/classModel.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken"; 
import dotenv from "dotenv";
import { IUser, IGrade } from '../models/userModel.js'; 
import { UserRequest } from '../middleware/auth.js'; 
import { ObjectId } from "mongoose";


dotenv.config(); 





// יצירת יוזר חדש
export const createUser = async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const myClass = await classModel.findOne({name: user.className});  

        if(user.role === "student"){
           if(!myClass){
               res.status(404).json({ message: "Class not found" });
               return;
           }
           const newUser  = await userModel.create(user);
           newUser.classId = myClass._id  as ObjectId;
           myClass.students!.push(newUser._id as ObjectId);
        }

        else {
            if(myClass){
                res.status(409).json({ message: "Class already exists" });
                return;
            }
            const newUser = await userModel.create(user);
            const newClass = await classModel.create({name: user.className});
            newUser.classId = newClass._id  as ObjectId;
            res.status(201).json(newClass._id); 
        }
        
    } catch (error:any) {
        res.status(409).json({ message: error.message });
    }
}



// לוגין של יוזר
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ password });

        if (!user || user.email !== email) {
            res.status(401).json({ message: 'Invalid credentials' });
            return; 
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 3600000, 
        });

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
}

