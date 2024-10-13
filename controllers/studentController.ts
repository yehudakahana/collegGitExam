import userModel from "../models/userModel.js";
import { Response } from "express";
import { UserRequest } from '../middleware/auth.js'; 
import { IUser, IGrade } from '../models/userModel.js'; 




//פונקציית עזר להבאת ציוני סטודנט ספציפי
const getGradeFromDB = async (password: string): Promise<any> => {
    try {
        const user = await userModel.findOne({ password });
        return user?.grades;
    } catch (error) {
        return null;
    }
    
}


// הבאת ציוני סטודנט ספציפי
export const getStudentGrades = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        const grades = await getGradeFromDB(req.user!.password);
        
        if (!grades) {
            res.status(404).json({ message: "User grades not found" });
            return;
        }

        res.status(200).json(grades);
    } catch (error) {
        res.status(500).json({ message: "Error getting student grades" });
    }
}


// הבאת ממוצע ציוני סטודנט
export const getStudentAverage = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        const grades = await getGradeFromDB(req.user!.password);

        
        if ( !grades || grades.length === 0) {
            res.status(404).json({ message: "User grades not found" });
            return;
        }

        const validGrades: IGrade[] = grades.filter((grade: IGrade) => typeof grade.score === 'number');
        const totalScore: number = validGrades.reduce((sum, grade) => sum + grade.score, 0);
        const average: number = validGrades.length > 0 ? totalScore / validGrades.length : 0;


        res.status(200).json({ average });
    } catch (error) {    
        res.status(500).json({ message: "Error getting student average" });
    }
}
  

