const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// Helper to generate JWT
function generateToken(userId){
    return jwt.sign(
        { id: userId},
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    )
}


// POST /api/auth/signup
async function signup(req,res) {
    try {
        const {username, email, password } = req.body

        // Basic validation
        if(!username || !email || !password){
            return res.status(400).json({message: 'All fields are required'})
        }

        // check if user already exists
        const existingUser = await User.findOne({
            $or: [{email}, {username}]
        })

        if(existingUser) {
            return res.status(400).json({message: 'Username or email already exist' })
        }

        // Hash password - never store plain text
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create User
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        })

        // Return token 
        const token = generateToken(user._id)
        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        })
    } catch (err) {
        res.status(500).json({ message: 'Server error', error:err.message})
    }
}

// POST /api/auth/login
async function login(req, res) {
    try {
        const {email, password } = req.body

        if(!email || !password){
            return res.status(400).json({ message: 'Both Email and Password are required' })
        }

        // FInd user
        const user = await User.findOne({ email })
        if(!user) {
            return res.staus(400).json({ message: 'Invalid credentials'})
        }

        // Compare password
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const token = generateToken(user._id)
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        })
    }
    catch(err) {
        res.status(500).json({ message: 'Server error', error: err.message})
    }
}

module.exports = { signup, login }
