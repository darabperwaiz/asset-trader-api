import mongoose from "mongoose";


export const db = async () => {
    await mongoose.connect(process.env.DB_URI).then(()=> console.log("Database Connected!")).catch((err)=> {
        console.log("Database not Connected!")
    })
}