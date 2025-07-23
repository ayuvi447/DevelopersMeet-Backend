import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    about:{
     type: String
    },
    age:{
      type: Number
    },
    

    photoUrl: {
      type: String,
      required: true,
      default: "nefnqefqaenfiqnaf",
    },
    skills: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.index({firstName:1}) // indexing 
userSchema.index({gender: 1})


userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "Vicky@123", {
    expiresIn: "7d",
  });
  console.log(token);

  return token;
};

userSchema.methods.getProfile = async function (){
  const user = this ;
  
}

export const User = mongoose.model("User", userSchema);
