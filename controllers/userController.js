import bcrypt from "bcryptjs"
import { tokenGenerator } from "../helper/tokenGen.js";
import { User } from "../models/User.js";

export const signup = async (req, res) => {
    try {
        const {username, email, password} = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({username, email, password: hashedPassword})
        const jwt_token = tokenGenerator(newUser._id)
        res.status(201).json({message: 'User created successfully', token: jwt_token})

    } catch (error) {
        res.status(400).json({message: error.message})
    }
}


export const login = async (req, res) => {
    try {
        const {username, password} = req.body

        const user = await User.findOne({username})
        if(!user) {
            return res.status(401).json({message: "Invalid Credentials"})
        }

        const verifyPassword = await bcrypt.compare(password, user.password)
        if(!verifyPassword) {
            return res.status(401).json({message: "Invalid Credentials"})
        }

        const jwt_token = tokenGenerator(user._id)
        res.status(200).json({message: 'Login successful', token: jwt_token})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}