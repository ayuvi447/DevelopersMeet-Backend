import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
export const isAuth = async (req, res, next) => {
  // read the token from the cookies
  try {
    const cookie = req.cookies;
    const { token } = cookie;

    const decodedMsg = await jwt.verify(token, "Vicky@123");
    const { _id } = decodedMsg;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User credentails invalid.");
    }
    req.user = user;
    next(); 
  } catch (err) {
    res.status(401).send("Error", err.message);
  }
};

// export const isUserAuth=(req,res,next)=>{
//     const tokenUser = 'user'
//     const isUserAuth = tokenUser ==="user"
//     if(!isUserAuth){
//         res.status(401).send('Not authorized user.')
//     }else{
//         console.log("userAuth called");
//         next()
//     }
// }
