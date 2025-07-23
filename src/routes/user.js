import express from 'express'
import { isAuth } from '../middlewares/isAuth.js'

import {userRequestsRecieved, connections , feed} from '../controllers/userControllers.js'
const Router = express.Router()

Router.get('/user/requests/received', isAuth, userRequestsRecieved)
Router.get('/user/connections', isAuth, connections)
Router.get('/feed', isAuth, feed)

export default Router