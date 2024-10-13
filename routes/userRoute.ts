import express from "express";
import { 
  createUser, 
  login, 

} from "../controllers/userController.js";

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


export default router;