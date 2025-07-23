import express from 'express'
import { register, login, getProfile, logout, updataProfile, deleteProfile, forgetPassword, getAllUsers } from '../controllers/authControllers.js'
import { isAuth } from '../middlewares/isAuth.js'

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", logout)
router.get("/getprofile/view", isAuth, getProfile)
router.patch('/updateprofile', isAuth, updataProfile)
// router.patch('/profile/view', isAuth, profileView)
router.delete('/deleteprofile', isAuth, deleteProfile)
router.patch('/forgetpassword', isAuth, forgetPassword)
router.get('/getallusers', isAuth, getAllUsers)


export default router