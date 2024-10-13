"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_js_1 = require("../controllers/userController.js");
const auth_js_1 = __importDefault(require("../middleware/auth.js"));
const router = express_1.default.Router();
/**
 * @swagger
 * /register:
 *  post:
 *      summary: Create a new user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                          passportId:
 *                              type: string
 *                              pattern: "^[0-9]{9}$"  # 9 ספרות
 *                          password:
 *                              type: string
 *                              pattern: "^[0-9]{8}$"  # 8 ספרות
 *                          role:
 *                              type: string
 *                              enum: [teacher, student]
 *                              default: student
 *          example:
 *              name: "name"
 *              passportId: "123456789"
 *              password: "12345678"
 *              role: "student"
 *      responses:
 *          200:
 *              description: User created successfully
 */
router.route("/register").post(userController_js_1.createUser);
/**
 * @swagger
 * /login:
 *  post:
 *      summary: Login a user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          passportId:
 *                              type: string
 *                              pattern: "^[0-9]{9}$"  # 9 ספרות
 *                          password:
 *                              type: string
 *                              pattern: "^[0-9]{8}$"  # 8 ספרות
 *                  example:
 *                      passportId: "123456789"
 *                      password: "12345678"
 *      responses:
 *          200:
 *              description: User login successfully
 */
router.route("/login").post(userController_js_1.login);
router.use(auth_js_1.default);
/**
 * @swagger
 * /teacher:
 *  get:
 *      summary: Get all users
 *      responses:
 *          200:
 *              description: Get all users
 */
router.route("/teacher").get(userController_js_1.getAllUsers);
/**
 * @swagger
 * /teacher/getGrades:
 *  get:
 *      summary: Get all grades
 *      responses:
 *          200:
 *              description: Get all grades
 */
router.route("/teacher/getGrades").get(userController_js_1.getAllGrades);
/**
 * @swagger
 * /teacher/getAvarege:
 *  get:
 *      summary: Get average grades for all students
 *      responses:
 *          200:
 *              description: Get average grades
 */
router.route("/teacher/getAvarege").get(userController_js_1.getAvaregeAll);
/**
 * @swagger
 * /teacher/addGrade:
 *  post:
 *      summary: Add a grade for a student
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          studentId:
 *                              type: string
 *                              example: "987654321"
 *                          grade:
    *                          subject:
    *                              type: string
    *                              example: "Math"
    *                          score:
    *                              type: number
    *                              example: 95
    *
 *                  required:
 *                      - studentId
 *                      - subject
 *                      - score
 *      responses:
 *          200:
 *              description: Grade added successfully
 */
router.route("/teacher/addGrade").post(userController_js_1.addGrade);
/**
 * @swagger
 * /student/grades:
 *  get:
 *      summary: Get grades for a specific student
 *      responses:
 *          200:
 *              description: Get student grades
 */
router.route("/student/grades").get(userController_js_1.getStudentGrades);
/**
 * @swagger
 * /student/avarege:
 *  get:
 *      summary: Get average grade for a specific student
 *      responses:
 *          200:
 *              description: Get student average
 */
router.route("/student/avarege").get(userController_js_1.getStudentAverage);
exports.default = router;
