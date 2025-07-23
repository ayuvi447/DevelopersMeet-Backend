import express from 'express'
import { isAuth } from '../middlewares/isAuth.js'
import { sendConnectionRequest, reviewConnectionRequest } from '../controllers/sendconnectionRequestControllers.js'
const Router = express.Router()

Router.post('/send/:status/:toUserId', isAuth, sendConnectionRequest)
Router.post('/review/:status/:requestId', isAuth, reviewConnectionRequest)


export default Router;