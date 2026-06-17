⚡ CodeSync

A real-time collaborative code editor where multiple developers can write, run, and discuss code together in the same room — like Google Docs, but for code.

🔗 Live Demo: code-sync-five-psi.vercel.app


What it does

CodeSync lets you create a room, share the link with someone, and code together in real time. Both of you see every keystroke instantly, can run the code and see the output, switch programming languages together, and chat without leaving the editor.

It's built for pair programming, mock interviews, teaching, or just debugging something with a friend.


Features


Real-time collaborative editing — powered by Socket.io, changes sync across all connected users in under 100ms
Multi-language code execution — run JavaScript, Python, C++, Java, or TypeScript directly in the browser and see live output
Room persistence — code and language choice are saved in Redis, so anyone joining a room later sees exactly where things left off
Live user presence — see who's in the room in real time, with join/leave notifications
In-room chat — a real-time chat sidebar to discuss code without switching tools
Secure authentication — JWT-based signup/login with hashed passwords and protected routes
VS Code-like editing experience — built on Monaco Editor, the same editor that powers VS Code



Tech Stack

Frontend: React (Vite), React Router, Monaco Editor, Socket.io Client

Backend: Node.js, Express, Socket.io, MongoDB (Mongoose), Redis, JWT, bcrypt

Code Execution: JDoodle API

Deployment: Vercel (frontend) · Render (backend) · Railway (Redis) · MongoDB Atlas (database)


Architecture

┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   React     │ ◄─────► │   Node.js /  │ ◄─────► │   MongoDB   │
│  (Vercel)   │ Socket  │   Express    │         │   (Atlas)   │
│             │  .io    │  (Render)    │         └─────────────┘
└─────────────┘         └──────┬───────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
              ┌─────▼─────┐         ┌───────▼──────┐
              │   Redis    │         │  JDoodle API │
              │ (Railway)  │         │ (execution)  │
              │ room state │         └──────────────┘
              └────────────┘

When a user types, the change is debounced and emitted over a Socket.io code_change event. The server broadcasts it to everyone else in the room (code_update) and persists the latest state to Redis. When a new user joins a room, the server checks Redis and sends them the current code and language instantly — so they're never starting from a blank editor.


Running it locally

Prerequisites: Node.js, MongoDB (local or Atlas), Redis (local or hosted)

bash# Clone the repo
git clone https://github.com/shahid-ali6307/CodeSync.git
cd CodeSync

# Backend setup
cd server
npm install
# Create a .env file — see .env.example for required variables
npm start

# Frontend setup (in a new terminal)
cd client
npm install
# Create a .env file — see .env.example for required variables
npm run dev

The app will be running at http://localhost:5173.

Environment variables

server/.env

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
JDOODLE_CLIENT_ID=your_jdoodle_client_id
JDOODLE_CLIENT_SECRET=your_jdoodle_client_secret
CLIENT_URL=http://localhost:5173

client/.env

VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000


What I learned building this

This project pushed me past basic CRUD apps into real-time systems — handling bidirectional sync without infinite event loops, debouncing high-frequency events, designing a Redis-backed persistence layer with TTL expiry, and deploying a multi-service production stack (separate frontend/backend/cache/database providers) with proper CORS and environment separation between dev and production.


Author : Shahid Ali
