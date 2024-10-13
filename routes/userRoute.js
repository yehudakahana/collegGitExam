import express from "express";
import { getAllUsers, createUser, login, getStudentGrades, getStudentAverage, getAllGrades, getAvaregeAll, addGrade } from "../controllers/userController.js";
import authenticateToken from "../middleware/auth.js";
const router = express.Router();
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
router.route("/register").post(createUser);
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
router.route("/login").post(login);
router.use(authenticateToken);
/**
 * @swagger
 * /teacher:
 *  get:
 *      summary: Get all users
 *      responses:
 *          200:
 *              description: Get all users
 */
router.route("/teacher").get(getAllUsers);
/**
 * @swagger
 * /teacher/getGrades:
 *  get:
 *      summary: Get all grades
 *      responses:
 *          200:
 *              description: Get all grades
 */
router.route("/teacher/getGrades").get(getAllGrades);
/**
 * @swagger
 * /teacher/getAvarege:
 *  get:
 *      summary: Get average grades for all students
 *      responses:
 *          200:
 *              description: Get average grades
 */
router.route("/teacher/getAvarege").get(getAvaregeAll);
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
 *                              example: "123456789"
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
router.route("/teacher/addGrade").post(addGrade);
/**
 * @swagger
 * /student/grades:
 *  get:
 *      summary: Get grades for a specific student
 *      responses:
 *          200:
 *              description: Get student grades
 */
router.route("/student/grades").get(getStudentGrades);
/**
 * @swagger
 * /student/avarege:
 *  get:
 *      summary: Get average grade for a specific student
 *      responses:
 *          200:
 *              description: Get student average
 */
router.route("/student/avarege").get(getStudentAverage);
export default router;
