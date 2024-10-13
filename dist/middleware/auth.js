"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
dotenv_1.default.config();
const authenticateToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.sendStatus(401);
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err)
            return res.sendStatus(403);
        const foundUser = await userModel_js_1.default.findById(decoded.id);
        if (!foundUser) {
            res.sendStatus(404);
            return;
        }
        req.user = foundUser;
        next();
    });
};
exports.default = authenticateToken;
