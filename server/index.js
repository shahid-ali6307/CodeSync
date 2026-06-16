const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config()

const authRoutes = require('./routes/auth')

const app = express()
const server = http.createServer(app) //wrap express in http server
const executeRoutes = require('./routes/execute')
const { connectRedis, saveRoomCode, getRoomCode } = require('./utils/redisClient')

const allowedOrigins = [
  'http://localhost:5173',
  'https://code-sync-five-psi.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (Postman, mobile apps)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    return callback(new Error('CORS blocked: ' + origin))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.options('/(.*)', cors())



//socket io attaches to the http server , not express...
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// }))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/execute', executeRoutes)


app.get('/', (req, res) => {
  res.json({ message: 'CodeSync server running' })
})





//Socket.io  logic ------------------------------

const rooms = {}

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id)

  // user joins a room _______________________
  socket.on('join_room', async ({ roomId,username }) => {
    socket.join(roomId)

  // Add user to room tracking................
  if(!rooms[roomId]) rooms[roomId] = []
  rooms[roomId].push({ socketId: socket.id, username })

  // tell everyone in the room the updated user list
  io.to(roomId).emit('room_users', rooms[roomId] )

  //tell others someone joined
  socket.to(roomId).emit('user_joined', { username })

  //Send existing room state to the NEW user only
  const savedState = await getRoomCode(roomId)
  if(savedState) {
    socket.emit('room_state', {
      code: savedState.code,
      language: savedState.language,
    })
  }
  })


   //user changed code.............
  socket.on('code_change',async ({ roomId, code }) => {
    //Boradcast everyone in the room except the sender
    socket.to(roomId).emit('code_change', { code })

    //Persist latest code to redis 
    await saveRoomCode(roomId, code, null)

  })

  //user changed language................
  socket.on('language_change', async ({ roomId, language }) => {
    socket.to(roomId).emit('language_change', { language })

    //Persist language - get existing code first to not overwrite...
    const existing = await getRoomCode(roomId)
    const code = existing?.code || ''
    await saveRoomCode(roomId, code, language)
  })

  socket.on('chat_message', ({ roomId, message, username }) => {

    if (!message || typeof message !== 'string') return
    if (message.trim().length === 0) return
    if (message.length > 500) return

    io.to(roomId).emit('chat_message' , {
      username,
      message,
      timestamp: new Date().toISOString(),
    })
  })

  // User disconnects--------------
  socket.on('disconnecting', () => {
  // socket.rooms has all the rooms this socket is in
  socket.rooms.forEach((roomId) => {
    if(rooms[roomId]) {
      const user = rooms[roomId].find(u => u.socketId === socket.id)


      //remove user from the room
      rooms[roomId] = rooms[roomId].filter(u => u.socketId !== socket.id)

      if(rooms[roomId].length === 0) {
        delete rooms[roomId]  //clean up empty rooms
      } else {
        //tell remaining user the updated list
        io.to(roomId).emit('room_users', rooms[roomId])

        if(user) {
          socket.to(roomId).emit('user_left', {username: user.username})
        }
      }
    }
  })
})


socket.on('disconnect', () => {
  console.log('Socket disconnected:', socket.id)
  })
})



// Connect MongoDB then start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected')
    await connectRedis()
    server.listen(process.env.PORT, () => {
      console.log(`Server on http://localhost:${process.env.PORT}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message)
  })