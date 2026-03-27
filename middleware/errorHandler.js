import { statusCode } from "../constants/statusCode.js"
export const errorHandler = (err,req,res,next) =>{
  console.error(err.stack)

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(statusCode.BAD_REQUEST).json({
      success: false,
      message: messages.join(', '),
    })
  }

  if (err.name === 'CastError') {
    return res.status(statusCode.BAD_REQUEST).json({
      success: false,
      message: 'Invalid ID format',
    })
  }

  if (err.name === 'MongoServerError' && err.code === 11000) {
    const field = Object.keys(err.keyValue).join(', ')
    return res.status(statusCode.CONFLICT).json({
      success: false,
      message: `Duplicate value for: ${field}`,
    })
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(statusCode.BAD_REQUEST).json({
      success: false,
      message: 'Malformed JSON in request body',
    })
  }

  const isProduction = process.env.NODE_ENV === 'production'

  res.status(err.status || statusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: isProduction ? 'Internal server error' : (err.message || 'Internal server error'),
  })
}