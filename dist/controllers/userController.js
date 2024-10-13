"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.createUser = void 0;
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
const classModel_js_1 = __importDefault(require("../models/classModel.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// יצירת יוזר חדש
const createUser = async (req, res) => {
    try {
        const user = req.body;
        const myClass = await classModel_js_1.default.findOne({ name: user.className });
        if (user.role === "student") {
            if (!myClass) {
                res.status(404).json({ message: "Class not found" });
                return;
            }
            const newUser = await userModel_js_1.default.create(user);
            newUser.classId = myClass._id;
            myClass.students.push(newUser._id);
            myClass.save();
            res.status(201).json(newUser._id);
        }
        else {
            if (myClass) {
                res.status(409).json({ message: "Class already exists" });
                return;
            }
            const newUser = await userModel_js_1.default.create(user);
            const newClass = await classModel_js_1.default.create({ name: user.className });
            newUser.classId = newClass._id;
            newUser.save();
            res.status(201).json(newClass._id);
        }
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
};
exports.createUser = createUser;
// לוגין של יוזר
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel_js_1.default.findOne({ password });
        if (!user || user.email !== email) {
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
