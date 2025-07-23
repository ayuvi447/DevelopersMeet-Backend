import mongoose from "mongoose";

export const connectDb=async()=>{
    await mongoose.connect("mongodb+srv://vicky9877262:kWCmNJh2QBXImDsU@cluster0.xa9v2ti.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
}

