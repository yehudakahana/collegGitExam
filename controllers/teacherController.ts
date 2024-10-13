import userModel from "../models/userModel.js";
import { Response } from "express";
import { UserRequest } from '../middleware/auth.js'; 


// הבאת כל היוזרים
export const getAllUsers = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== "teacher") { 
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return; 
        }

        const users = await userModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: "Error getting all users" });
    }
}


// הבאת כל השמות עם הציונים שלהם
export const getAllGrades = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== "teacher") { 
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return; 
        }   

        const usersWithGrades = await userModel.aggregate([
            {
                $match: {
                    role: "student"
                }
            },
            {
                $project: {     
                    _id : 0,              
                    name: 1,
                    grades: 1
                }
            }
        ]);

        res.status(200).json(usersWithGrades);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting all grades" });
    }
}

// הבאת ממוצע ציוני כל הסטודנטים
export const getAvaregeAll = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== "teacher") { 
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return; 
        }

        const avarege = await userModel.aggregate([
            {
                $match: {
                    role: "student"
                }
            },
            {
                $unwind: "$grades" 
            },
            {
                $group: {
                    _id: null, 
                    averageOfAll: { $avg: "$grades.score" } 
                }   
            },
            {
                $project: {
                    _id: 0, 
                    averageOfAll: 1 
                }
            }
        ]);
        
        
        res.status(200).json(avarege);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting all grades" });
    }
}

//הוספת ציון לסטודנט
export const addGrade = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== "teacher") { 
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return; 
        }   

        const { password, grade } = req.body;

        if (!password || !grade) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        const updatedGrade = await userModel.findOneAndUpdate(
            { password },
            { $push: { grades: { ...grade } } },
            { new: true }
        );

        if (!updatedGrade) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(grade);
    } catch (error) {
        res.status(500).json({ message: "Error adding grade" });
    }
}