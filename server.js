import express from "express"
import dotenv from "dotenv"
dotenv.config()
import {db} from './config/dbConnection.js'
import userRoutes from "./routes/userRoutes.js"
import assetRoutes from "./routes/assetRoutes.js"
import requestRoutes from "./routes/requestRoutes.js"

// Initialize app
export const app = express()

app.use(express.json())

app.use('/auth', userRoutes)
app.use('/', assetRoutes)
app.use('/', requestRoutes)

// Assign PORT number
const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> {
    console.log("Server is Running on Port",PORT)
    db()
})

