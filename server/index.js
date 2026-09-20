const express = require('express')
const http = require('http')
const cors = require('cors')
const mongoose = require('mongoose')
const { Server } = require('socket.io')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const executeRoutes = require('./routes/execute')
const { connectRedis, saveRoomCode, getRoomCode } = require('./utils/redisClient')

const app = express()
const server = http.createServer(app)

function isAllowedOrigin(origin) {
  if (!origin) return true
  if (origin === 'http://localhost:5173') return true
  if (origin.endsWith('.vercel.app')) return true
  if (origin === process.env.CLIENT_URL) return true
  return false
}

const io = new Server(server, {
  cors: {
    origin: function(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true)
      } else {
        callback(new Error(`CORS blocked: ${origin}`))
      }
    },
    methods: ['GET', 'POST'],
  },
})

app.use(cors({
  origin: function(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS blocked: ${origin}`))
    }
  },
  credentials: true,
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/execute', executeRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'CodeSync server running' })
})

const rooms = {}

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id)

  socket.on('join_room', async ({ roomId, username }) => {
    socket.join(roomId)

    if (!rooms[roomId]) rooms[roomId] = []
    rooms[roomId].push({ socketId: socket.id, username })

    io.to(roomId).emit('room_users', rooms[roomId])
    socket.to(roomId).emit('user_joined', { username })

    const savedState = await getRoomCode(roomId)
    if (savedState) {
      socket.emit('room_state', {
        code: savedState.code,
        language: savedState.language,
      })
    }
  })

  socket.on('code_change', async ({ roomId, code }) => {
    socket.to(roomId).emit('code_update', { code })

    const existing = await getRoomCode(roomId)
    const language = existing?.language || 'javascript'
    await saveRoomCode(roomId, code, language)
  })

  socket.on('language_change', async ({ roomId, language }) => {
    socket.to(roomId).emit('language_update', { language })

    const existing = await getRoomCode(roomId)
    const code = existing?.code || ''
    await saveRoomCode(roomId, code, language)
  })

  socket.on('chat_message', ({ roomId, message, username }) => {
    if (!message || typeof message !== 'string') return
    if (message.trim().length === 0) return
    if (message.length > 500) return

    io.to(roomId).emit('chat_message', {
      username,
      message: message.trim(),
      timestamp: new Date().toISOString(),
    })
  })

  socket.on('disconnecting', () => {
    socket.rooms.forEach((roomId) => {
      if (rooms[roomId]) {
        const user = rooms[roomId].find(u => u.socketId === socket.id)
        rooms[roomId] = rooms[roomId].filter(u => u.socketId !== socket.id)

        if (rooms[roomId].length === 0) {
          delete rooms[roomId]
        } else {
          io.to(roomId).emit('room_users', rooms[roomId])
          if (user) {
            socket.to(roomId).emit('user_left', { username: user.username })
          }
        }
      }
    })
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id)
  })
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected')
    await connectRedis()
    server.listen(process.env.PORT || 5000, () => {
      console.log(`Server on http://localhost:${process.env.PORT || 5000}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message)
  })