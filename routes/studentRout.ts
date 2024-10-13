import express from "express";
import authenticateToken from "../middleware/auth.js"; 
import { getStudentGrades, getStudentAverage } from "../controllers/studentController.js";


const router = express.Router();

router.use(authenticateToken); 




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
