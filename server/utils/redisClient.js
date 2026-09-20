// const { createClient } = require('redis')

// const client = createClient({ 
//     url: process.env.REDIS_URL || 'redis://localhost:6379'
// })

// client.on('error', (err) => {
//     console.error('Redis error:', err.message)
// })

// client.on('connect', () => {
//     console.log('Redis connected')
// })

// async function connectRedis() {
//     if(!client.isOpen) {
//         await client.connect()
//     }
// }

// async function saveRoomCode(roomId, code, language) {
//     try {
//         const data = JSON.stringify({ code, language })
//         await client.setEx(`room:${roomId}`, 86400, data)
//     } catch(err) {
//         console.error('Reddis saveRoomCode error', err.message)
//     }
// }

// // get room code
// async function getRoomCode(roomId) {
//     try{
//         const data = await client.get(`room:${roomId}`)
//         return data ? JSON.parse(data) : null
//     } catch(err) {
//         console.error('Redis getRoomCode error', err.message)
//     }
// }

// // delete room (optional cleanup)

// async function deleteRoom(roomId) {
//     try {
//         await client.del(`room:${roomId}`)
//     }catch(err) {
//         console.error('Redis deleteRoom error', err.message)
//     }
// }

// module.exports = {connectRedis, saveRoomCode, getRoomCode, deleteRoom}




const { createClient } = require('redis')

let client = null
let isConnected = false

async function connectRedis() {
  try {
    client = createClient({
      url: process.env.REDIS_URL,
      socket: {
        tls: true,
        rejectUnauthorized: false,
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.log('Redis unavailable — running without persistence')
            isConnected = false
            return false
          }
          return 1000
        }
      }
    })

    client.on('error', (err) => {
      if (err.message !== lastError) {
        console.error('Redis error:', err.message)
        lastError = err.message
      }
      isConnected = false
    })

    client.on('connect', () => {
      console.log('Redis connected')
      isConnected = true
      lastError = null
    })

    await client.connect()

  } catch (err) {
    console.log('Redis unavailable — running without persistence')
    isConnected = false
  }
}

let lastError = null

async function saveRoomCode(roomId, code, language) {
  if (!isConnected || !client) return
  try {
    const data = JSON.stringify({ code, language })
    await client.setEx(`room:${roomId}`, 86400, data)
  } catch (err) {}
}

async function getRoomCode(roomId) {
  if (!isConnected || !client) return null
  try {
    const data = await client.get(`room:${roomId}`)
    return data ? JSON.parse(data) : null
  } catch (err) {
    return null
  }
}

async function deleteRoom(roomId) {
  if (!isConnected || !client) return
  try {
    await client.del(`room:${roomId}`)
  } catch (err) {}
}

module.exports = { connectRedis, saveRoomCode, getRoomCode, deleteRoom }