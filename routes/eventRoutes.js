import express from 'express'
import { createEvent, getEventsByMembers, updateEvent, getEventLogs } from '../controllers/eventController.js'
import { mutationLimiter } from '../middleware/rateLimiter.js'
import { cacheMiddleware } from '../middleware/cache.js'

const eventRouter = express.Router()

eventRouter.post('/', mutationLimiter, createEvent)
eventRouter.get('/member/:userId', cacheMiddleware(60), getEventsByMembers)
eventRouter.patch('/:eventId', mutationLimiter, updateEvent)
eventRouter.get('/:eventId/logs', cacheMiddleware(30), getEventLogs)

export default eventRouter