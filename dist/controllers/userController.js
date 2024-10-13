"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addGrade = exports.getAvaregeAll = exports.getAllGrades = exports.getAllUsers = exports.getStudentAverage = exports.getStudentGrades = exports.login = exports.createUser = void 0;
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// יצירת יוזר חדש
const createUser = async (req, res) => {
    try {
        const user = req.body;
        const newUser = await userModel_js_1.default.create(user);
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
};
exports.createUser = createUser;
// לוגין של יוזר
const login = async (req, res) => {
    const { passportId, password } = req.body;
    try {
        const user = await userModel_js_1.default.findOne({ passportId });
        if (!user || user.password !== password) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
};
exports.login = login;
//פונקציית עזר להבאת ציוני סטודנט ספציפי
const getGradeFromDB = async (passportId) => {
    try {
        const user = await userModel_js_1.default.findOne({ passportId });
        return user?.grades;
    }
    catch (error) {
        return null;
    }
};
// הבאת ציוני סטודנט ספציפי
const getStudentGrades = async (req, res) => {
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
};
exports.getStudentGrades = getStudentGrades;
// הבאת ממוצע ציוני סטודנט
const getStudentAverage = async (req, res) => {
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
};
exports.getStudentAverage = getStudentAverage;
////////////////////////////////////////////////////////////////////////////////////////
//Teacher 
// הבאת כל היוזרים
const getAllUsers = async (req, res) => {
    try {
        if (req.user?.role !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }
        const users = await userModel_js_1.default.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(404).json({ message: "Error getting all users" });
    }
};
exports.getAllUsers = getAllUsers;
// הבאת כל השמות עם הציונים שלהם
const getAllGrades = async (req, res) => {
    try {
        if (req.user?.role !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }
        const usersWithGrades = await userModel_js_1.default.aggregate([
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
};
exports.getAllGrades = getAllGrades;
// הבאת ממוצע ציוני כל הסטודנטים
const getAvaregeAll = async (req, res) => {
    try {
        if (req.user?.role !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }
        const avarege = await userModel_js_1.default.aggregate([
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
};
exports.getAvaregeAll = getAvaregeAll;
//הוספת ציון לסטודנט
const addGrade = async (req, res) => {
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
        const updatedGrade = await userModel_js_1.default.findOneAndUpdate({ passportId }, { $push: { grades: { ...grade } } }, { new: true });
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
};
exports.addGrade = addGrade;
