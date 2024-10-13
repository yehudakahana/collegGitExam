"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const connect = await mongoose_1.default.connect("mongodb+srv://yk3222145:lZcnjdtahz6MrVT8@cluster0.21bgr.mongodb.net/CollegeExam?retryWrites=true&w=majority&appName=Cluster0");
        console.log("Connected to DB");
    }
    catch (error) {
        console.error("Error connecting to the database", error);
    }
};
exports.default = connectDB;
