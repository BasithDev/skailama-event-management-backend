import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import userRouter from './routes/userRoutes.js'
import eventRouter from './routes/eventRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { globalLimiter } from './middleware/rateLimiter.js'
import { statusCode } from './constants/statusCode.js'

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use(helmet())
app.use(morgan('dev'))

app.use(express.json({ limit: '10kb' }))

app.use(globalLimiter)
app.use('/api/users', userRouter)
app.use('/api/events', eventRouter)
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' })
})

app.use((req, res) => {
  res.status(statusCode.NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  })
})

app.use(errorHandler)
export default app