"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentAverage = exports.getStudentGrades = void 0;
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
//פונקציית עזר להבאת ציוני סטודנט ספציפי
const getGradeFromDB = async (password) => {
    try {
        const user = await userModel_js_1.default.findOne({ password });
        return user?.grades;
    }
    catch (error) {
        return null;
    }
};
// הבאת ציוני סטודנט ספציפי
const getStudentGrades = async (req, res) => {
    try {
        const grades = await getGradeFromDB(req.user.password);
        if (!grades) {
            res.status(404).json({ message: "User grades not found" });
            return;
        }
        res.status(200).json(grades);
    }
    catch (error) {
        res.status(500).json({ message: "Error getting student grades" });
    }
};
exports.getStudentGrades = getStudentGrades;
// הבאת ממוצע ציוני סטודנט
const getStudentAverage = async (req, res) => {
    try {
        const grades = await getGradeFromDB(req.user.password);
        if (!grades || grades.length === 0) {
            res.status(404).json({ message: "User grades not found" });
            return;
        }
        const validGrades = grades.filter((grade) => typeof grade.score === 'number');
        const totalScore = validGrades.reduce((sum, grade) => sum + grade.score, 0);
        const average = validGrades.length > 0 ? totalScore / validGrades.length : 0;
        res.status(200).json({ average });
    }
    catch (error) {
        res.status(500).json({ message: "Error getting student average" });
    }
};
exports.getStudentAverage = getStudentAverage;
