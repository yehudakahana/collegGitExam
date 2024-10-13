import express from "express";
import authenticateToken from "../middleware/auth.js"; 
import { getAllUsers, getAvaregeAll, getAllGrades, addGrade, updateGrade } from "../controllers/teacherController.js";

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


router.route("/teacher/addGrade").post(addGrade);

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
router.route("/teacher/updateGrade").post(updateGrade);

export default router;
