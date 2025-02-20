import express from "express"
import { login, signup } from "../controllers/userController.js"

const userRoutes = express.Router()

userRoutes.post('/signup', signup)
userRoutes.post('/login', login)

export default userRoutes