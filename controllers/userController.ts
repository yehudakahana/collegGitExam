import userModel from "../models/userModel.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken"; 
import dotenv from "dotenv";
import { IUser, IGrade } from '../models/userModel.js'; 
import { UserRequest } from '../middleware/auth.js'; 

dotenv.config(); 





// יצירת יוזר חדש
export const createUser = async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const newUser = await userModel.create(user);
        res.status(201).json(newUser);
    } catch (error:any) {
        res.status(409).json({ message: error.message });
    }
}

// לוגין של יוזר
export const login = async (req: Request, res: Response): Promise<void> => {
    const { passportId, password } = req.body;

    try {
        const user = await userModel.findOne({ passportId });

        if (!user || user.password !== password) {
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




//פונקציית עזר להבאת ציוני סטודנט ספציפי
const getGradeFromDB = async (passportId: string): Promise<any> => {
    try {
        const user = await userModel.findOne({ passportId });
        return user?.grades;
    } catch (error) {
        return null;
    }
    
}


// הבאת ציוני סטודנט ספציפי
export const getStudentGrades = async (req: UserRequest, res: Response): Promise<void> => {
    // try {
    //     const grades = await getGradeFromDB(req.user!.passportId);
        
    //     if (!grades) {
    //         res.status(404).json({ message: "User grades not found" });
    //         return;
    //     }

    //     res.status(200).json(grades);
    // } catch (error) {
    //     res.status(500).json({ message: "Error getting student grades" });
    // }
}


// הבאת ממוצע ציוני סטודנט
export const getStudentAverage = async (req: UserRequest, res: Response): Promise<void> => {
    // try {
    //     const grades = await getGradeFromDB(req.user!.passportId);

        
    //     if ( !grades || grades.length === 0) {
    //         res.status(404).json({ message: "User grades not found" });
    //         return;
    //     }

    //     const validGrades: IGrade[] = grades.filter((grade: IGrade) => typeof grade.score === 'number');
    //     const totalScore: number = validGrades.reduce((sum, grade) => sum + grade.score, 0);
    //     const average: number = validGrades.length > 0 ? totalScore / validGrades.length : 0;


    //     res.status(200).json({ average });
    // } catch (error) {    
    //     res.status(500).json({ message: "Error getting student average" });
    // }
}
  



////////////////////////////////////////////////////////////////////////////////////////
//Teacher 



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

        const { passportId, grade } = req.body;

        if (!passportId || !grade) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }

        const updatedGrade = await userModel.findOneAndUpdate(
            { passportId },
            { $push: { grades: { ...grade } } },
            { new: true }
        );

        if (!updatedGrade) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(grade);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding grade" });
    }
}