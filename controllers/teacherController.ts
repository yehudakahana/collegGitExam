import userModel from "../models/userModel.js";
import { Response } from "express";
import { UserRequest } from '../middleware/auth.js'; 
import classModel from "../models/classModel.js";


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



// הבאת ציוני כל הסטודנטים בכיתה
export const getAllGrades = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        const teacher = req.user!;
        if (teacher.role !== "teacher") { 
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return; 
        }   
         
        const classroom = await classModel.findById(teacher.classId).populate('students');
        res.status(200).json(classroom);

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
        const { studentId, grade } = req.body;
        if (!studentId || !grade) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        
        const student = await userModel.findById(studentId);
        if (!student) {
            res.status(404).json({ message: "Student not found" });
            return;
        }
        if(student?.className !== req.user!.className){
            res.status(403).json({ message: "Forbidden: you can only add grades to your own class." });
        }

        const updatedGrade = await userModel.findOneAndUpdate(
            { _id: studentId },
            { $push: { grades: { ...grade } } },
            { new: true }
        );

        res.status(200).json(updatedGrade);
    } catch (error) {
        res.status(500).json({ message: "Error adding grade" });
    }
}


//עדכון ציון
export const updateGrade = async (req: UserRequest, res: Response): Promise<void> => {
    // try {
    //     if (req.user?.role !== "teacher") { 
    //         res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
    //         return; 
    //     }   
    //     const { studentId, grade } = req.body;
    //     if (!studentId || !grade) {
    //         res.status(400).json({ message: "Missing required fields" });
    //         return;
    //     }
    //     const updatedGrade = await userModel.findOneAndUpdate(
    //         { _id: studentId, "grades._id": grade._id },
    //         { $set: { "grades.$": grade } },
    //         { new: true }
    //     );
    //     res.status(200).json(updatedGrade);
    // } catch (error) {
    //     res.status(500).json({ message: "Error updating grade" });
    // }
}