import jwt from 'jsonwebtoken'
import { User } from "../models/User.js"

export const auth = async (req, res, next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        }
        
        if(!token) {
            return res.status(401).json({message: 'Unauthorized!'})
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET)
        const currentUser = await User.findById(decode.id)
        if(!currentUser) {
            return res.status(401).json({message: 'User not found'})
        }
        
        req.user = currentUser
        
        next()
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
}