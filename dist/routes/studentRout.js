"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_js_1 = __importDefault(require("../middleware/auth.js"));
const studentController_js_1 = require("../controllers/studentController.js");
const router = express_1.default.Router();
router.use(auth_js_1.default);
/**
 * @swagger
 * /student/grades:
 *  get:
 *      summary: Get grades for a specific student
 *      responses:
 *          200:
 *              description: Get student grades
 */
router.route("/student/grades").get(studentController_js_1.getStudentGrades);
/**
 * @swagger
 * /student/avarege:
 *  get:
 *      summary: Get average grade for a specific student
 *      responses:
 *          200:
 *              description: Get student average
 */
router.route("/student/avarege").get(studentController_js_1.getStudentAverage);
exports.default = router;
