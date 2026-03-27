import express from 'express'
import { getAllUsers, createUser } from '../controllers/userController.js'
import { mutationLimiter } from '../middleware/rateLimiter.js'
import { cacheMiddleware } from '../middleware/cache.js'

const userRouter = express.Router()

userRouter.get('/', cacheMiddleware(60), getAllUsers)
userRouter.post('/', mutationLimiter, createUser)

export default userRouter