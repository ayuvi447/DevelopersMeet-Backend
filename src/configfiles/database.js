import mongoose from "mongoose";

export const connectDb=async()=>{
    console.log(process.env.DB_SECRET);
    
    await mongoose.connect(process.env.DB_SECRET)
}

