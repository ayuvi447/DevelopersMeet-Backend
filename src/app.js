import express from "express";
import cors from 'cors'
import { isAuth } from "./middlewares/isAuth.js";
// import { isUserAuth } from "./middlewares/isAuth.js";
import { connectDb } from "./configfiles/database.js";
import { User } from "./models/user.js";
import validator from "validator";
import dotenv from 'dotenv';


import cookieParser from "cookie-parser"
import authRouter from './routes/authRoutes.js'
import request from './routes/request.js'
import userRouter from './routes/user.js'
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const app = express();
app.use(cors({
  origin: ["http://localhost:5173", "https://developersmeet-frontend2.onrender.com"], // replace with actual frontend Render URL
  credentials: true
}));
dotenv.config();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 3009;

// // app.use((req, res) => {
// //   res.send("Hello from the server");
// // });

// // app.get("/user/:userId", (req, res) => {
// //   console.log(req.query);
// //   console.log(req.params);
// //   res.send({firstName:"vicky", lastName:"kumar"})
// // });

// // app.use('/user',(req, res, next)=>{
// //   // console.log("Hi handling 1");
// //   // res.send('API handiling 1')
// //   next()
// // },
// // (req,res)=>{
// //   console.log('Hi handling 2');
// //   res.send('api handling 2')

// // }
// // )

// // middleware for all type of routes

// app.use("/admin", isAuth)

//   // const token = "xyz";
//   // const isAuth = token === "xyz";
//   // if (!isAuth) {
//   //   res.status(401).send("Not authorized admin.");
//   // } else {
//   //   next();
//   // });

// app.get("/admin/deletePost", (req, res) => {
//   res.send('Delete all users data.')
// });
// app.get('/user/getAllData', isUserAuth, (req, res)=>{
//   res.send('User all data is deleted. sir ')
// })

// first connect to the db then listen to the port
// app.post("/signup", async (req, res) => {
// //  const { firstName, lastName, emailId, password, gender, photoU } = req.body;
// // // const data = req.body

// //   const user = new User(data);

// //   try {
// //     await user.save();
// //     res.send("User added successfully");
// //     console.log(user);
// //   } catch (err) {
// //     console.log(err);
// //   }

// });

app.use('/', authRouter)
app.use('/request', request)
app.use('/', userRouter)



app.get("/user", async (req, res) => {
  const userEmailID = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmailID });
    res.send(user);
    console.log("user data", user);
  } catch (error) {
    console.log("Error h bhai", error);
  }
});









// sendconnection request api

app.post("/sendconnectionrequest", isAuth, async (req, res) => {
  // sending a connection request
  try {
    res.send('Connection request send successfully.')
  } catch (err) {
    console.log("Error", err.message);
  }
});
connectDb()
  .then(() => {
    console.log("connected successfully to DB.");
    app.listen(PORT, () => {
      console.log(`Listining to port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err, "occured");
  });
