import 'dotenv/config'

import mongoose from 'mongoose'
import app from './app.js'
import connectDB from './config/db.js'
import validateEnv from './config/env.js'

const config = validateEnv()

const server = app.listen(config.PORT, async () => {
  try {
    await connectDB(config.MONGO_URI)
    console.log(`Server running on port ${config.PORT} [${config.NODE_ENV}]`)
  } catch (err) {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  }
})

const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`)

  server.close(async () => {
    try {
      await mongoose.connection.close()
      console.log('MongoDB connection closed')
      process.exit(0)
    } catch (err) {
      console.error('Error during shutdown:', err.message)
      process.exit(1)
    }
  })
  setTimeout(() => {
    console.error('Forced shutdown after timeout')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))