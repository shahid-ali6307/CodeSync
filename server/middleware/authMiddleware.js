const jwt = require('jsonwebtoken')

function protect(req, res, next) {
  const authHeader = req.headers.authorization
  console.log('Auth header received:', authHeader) 

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded  // { id: userId }
    next()
  } catch (err) {
    console.log('Token verify error:', err.message)
    res.status(401).json({ message: 'Token invalid or expired' })
  }
}

module.exports = protect