"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        match: [/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/, "please provide valid email"],
    },
    password: {
        type: String,
        required: true,
        unique: true,
        match: [/^[0-8]{8}$/, "password must be 8 digits"],
    },
    grades: {
        type: [{
                subject: {
                    type: String,
                    required: [true, "Please provide subject name"],
                },
                score: {
                    type: Number,
                    required: [true, "Please provide score"],
                },
                commant: {
                    type: String,
                    required: [true, "Please provide commant"],
                },
            }],
    },
    role: {
        type: String,
        enum: ["teacher", "student"],
        required: true,
    },
    className: {
        type: String,
        required: [true, 'Please provide class name'],
    },
    classId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Class",
    }
});
exports.default = mongoose_1.default.model("User", userSchema);
