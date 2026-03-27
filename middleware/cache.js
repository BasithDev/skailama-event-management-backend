import NodeCache from 'node-cache'

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 })

export const cacheMiddleware = (ttl = 60) => {
  return (req, res, next) => {
    const key = req.originalUrl

    const cached = cache.get(key)
    if (cached) {
      return res.json(cached)
    }
    const originalJson = res.json.bind(res)
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) cache.set(key, body, ttl)
      return originalJson(body)
    }
    next()
  }
}

export const invalidateCache = (patterns) => {
  const keys = cache.keys()
  for (const key of keys) {
    if (patterns.some((pattern) => key.includes(pattern))) cache.del(key)
  }
}

export default cache
