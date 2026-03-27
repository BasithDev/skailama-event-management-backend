const requiredVars = ['MONGO_URI','PORT','NODE_ENV','CORS_ORIGIN']

const validateEnv = () => {
  const missing = requiredVars.filter((key)=> !process.env[key])

  if (missing.length >0) throw new Error(`Missing required environment variables: ${missing.join(', ')}`)

  return Object.freeze({
    MONGO_URI: process.env.MONGO_URI,

    PORT: parseInt(process.env.PORT, 10) || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  })
}

export default validateEnv
