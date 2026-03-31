require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

const app = express()
const port = process.env.PORT || 5000

connectDB()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())

const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)
const taskRoutes = require('./routes/taskRoutes')
app.use('/api/tasks', taskRoutes)

app.get('/', (req, res) => {
    res.send('Hello World! hi!!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})