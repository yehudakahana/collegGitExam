var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// יצירת יוזר חדש
export const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const newUser = yield userModel.create(user);
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
});
// לוגין של יוזר
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { passportId, password } = req.body;
    try {
        const user = yield userModel.findOne({ passportId });
        if (!user || user.password !== password) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
        });
        res.status(200).json({ message: 'Login successful' });
    }
    catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
});
//פונקציית עזר להבאת ציוני סטודנט ספציפי
const getGradeFromDB = (passportId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel.findOne({ passportId });
        return user === null || user === void 0 ? void 0 : user.grades;
    }
    catch (error) {
        return null;
    }
});
// הבאת ציוני סטודנט ספציפי
export const getStudentGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const grades = yield getGradeFromDB(req.user.passportId);
        if (!grades) {
            res.status(404).json({ message: "User grades not found" });
            return;
        }
        res.status(200).json(grades);
    }
    catch (error) {
        res.status(500).json({ message: "Error getting student grades" });
    }
});
// הבאת ממוצע ציוני סטודנט
export const getStudentAverage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const grades = yield getGradeFromDB(req.user.passportId);
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
});
////////////////////////////////////////////////////////////////////////////////////////
//Teacher 
// הבאת כל היוזרים
export const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }
        const users = yield userModel.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(404).json({ message: "Error getting all users" });
    }
});
// הבאת כל השמות עם הציונים שלהם
export const getAllGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }
        const usersWithGrades = yield userModel.aggregate([
            {
                $match: {
                    role: "student"
                }
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    grades: 1
                }
            }
        ]);
        res.status(200).json(usersWithGrades);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting all grades" });
    }
});
// הבאת ממוצע ציוני כל הסטודנטים
export const getAvaregeAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }
        const avarege = yield userModel.aggregate([
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting all grades" });
    }
});
//הוספת ציון לסטודנט
export const addGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }
        const { passportId, grade } = req.body;
        if (!passportId || !grade) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const updatedGrade = yield userModel.findOneAndUpdate({ passportId }, { $push: { grades: Object.assign({}, grade) } }, { new: true });
        if (!updatedGrade) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(grade);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding grade" });
    }
});
