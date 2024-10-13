"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_js_1 = __importDefault(require("../middleware/auth.js"));
const teacherController_js_1 = require("../controllers/teacherController.js");
const router = express_1.default.Router();
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
router.route("/teacher").get(teacherController_js_1.getAllUsers);
/**
 * @swagger
 * /teacher/getGrades:
 *  get:
 *      summary: Get all grades
 *      responses:
 *          200:
 *              description: Get all grades
 */
router.route("/teacher/getGrades").get(teacherController_js_1.getAllGrades);
/**
 * @swagger
 * /teacher/getAvarege:
 *  get:
 *      summary: Get average grades for all students
 *      responses:
 *          200:
 *              description: Get average grades
 */
router.route("/teacher/getAvarege").get(teacherController_js_1.getAvaregeAll);
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
 *                              type: object
 *                              properties:
 *                                  subject:
 *                                      type: string
 *                                      example: "Math"
 *                                  score:
 *                                      type: number
 *                                      example: 95
 *                                  commant:   # Fixed typo from "commant" to "comment"
 *                                      type: string
 *                                      example: "excellent"
 *                      required:
 *                          - studentId
 *                          - grade  # Changed from "subject" to "grade" for correctness
 *                          - score  # Added "score" under the grade object
 *      responses:
 *          200:
 *              description: Grade added successfully
 */
router.route("/teacher/addGrade").post(teacherController_js_1.addGrade);
/**
 * @swagger
 * /teacher/updateGrade:
 *  post:
 *      summary: update  grade for a student
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
 *                              type: object
 *                              properties:
 *                                  subject:
 *                                      type: string
 *                                      example: "Math"
 *                                  score:
 *                                      type: number
 *                                      example: 95
 *                                  commant:
 *                                      type: string
 *                                      example: "excellent"
 *                      required:
 *                          - studentId
 *                          - grade
 *
 *      responses:
 *          200:
 *              description: Grade updated successfully
 */
router.route("/teacher/updateGrade").post(teacherController_js_1.updateGrade);
exports.default = router;
