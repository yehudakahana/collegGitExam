"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGrade = exports.addGrade = exports.getAvaregeAll = exports.getAllGrades = exports.getAllUsers = void 0;
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
const classModel_js_1 = __importDefault(require("../models/classModel.js"));
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
// הבאת ציוני כל הסטודנטים בכיתה
const getAllGrades = async (req, res) => {
    try {
        const teacher = req.user;
        if (teacher.role !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }
        const classroom = await classModel_js_1.default.findById(teacher.classId).populate('students');
        res.status(200).json(classroom);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting all grades" });
    }
};
exports.getAllGrades = getAllGrades;
// הבאת ממוצע כל הציונים בכיתה
const getAvaregeAll = async (req, res) => {
    try {
        const teacher = req.user;
        if (teacher.role !== "teacher") {
            res.status(403).json({ message: "Forbidden: Only teachers can access this resource." });
            return;
        }
        const avarege = await userModel_js_1.default.aggregate([
            {
                $match: {
                    role: "student",
                    className: teacher.className
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
        const { studentId, grade } = req.body;
        if (!studentId || !grade) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const student = await userModel_js_1.default.findById(studentId);
        if (!student) {
            res.status(404).json({ message: "Student not found" });
            return;
        }
        if (student?.className !== req.user.className) {
            res.status(403).json({ message: "Forbidden: you can only add grades to your own class." });
        }
        const updatedGrade = await userModel_js_1.default.findOneAndUpdate({ _id: studentId }, { $push: { grades: { ...grade } } }, { new: true });
        res.status(200).json(updatedGrade);
    }
    catch (error) {
        res.status(500).json({ message: "Error adding grade" });
    }
};
exports.addGrade = addGrade;
//עדכון ציון
const updateGrade = async (req, res) => {
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
        const student = await userModel_js_1.default.findById(studentId);
        if (!student) {
            res.status(404).json({ message: "Student not found" });
            return;
        }
        if (student?.className !== req.user.className) {
            res.status(403).json({ message: "Forbidden: you can only add grades to your own class." });
        }
        const updatedGrade = await userModel_js_1.default.findOneAndUpdate({ _id: studentId, "grades.subject": grade.subject }, { $set: { "grades.$": grade } });
        res.status(200).json(updatedGrade);
    }
    catch (error) {
        res.status(500).json({ message: "Error updating grade" });
    }
};
exports.updateGrade = updateGrade;
