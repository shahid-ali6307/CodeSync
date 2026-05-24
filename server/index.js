const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req,res) => {
    res.json({message: 'CodeSync server is running' })
})

const port = 5000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}` )
})