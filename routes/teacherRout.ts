import express from "express";
import authenticateToken from "../middleware/auth.js"; 
import { getAllUsers, getAvaregeAll, getAllGrades, addGrade } from "../controllers/teacherController.js";

const router = express.Router();
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
router.route("/teacher/addGrade").post(addGrade);

export default router;
