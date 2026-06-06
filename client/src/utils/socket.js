import { io } from 'socket.io-client'

// Create one socket instance for the whole app
// Don't connect immediately — connect manually when entering a room

const socket = io('http://localhost:5000', {
    autoConnect: false,
})

export default socket