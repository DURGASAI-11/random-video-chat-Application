const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const path = require('path')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const mongoDB = require('./database/connect')

dotenv.config({ path: './config.env' })

const viewRouter = require('./router/viewRout')
const linkedRouter = require('./router/linkedinRout')
const adminRouter = require('./router/adminRout')

const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(express.static('./public'))

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/views', viewRouter)
app.use('/auth/linkedin', linkedRouter)

const rooms = {}

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message)
    const { roomId, userId } = data
    if (!rooms[roomId]) {
      rooms[roomId] = {}
    }
    rooms[roomId][userId] = ws

    const clients = Object.values(rooms[roomId])
    clients.forEach((client) => {
      if (client !== ws) {
        client.send(JSON.stringify({ type: 'user-connected', userId }))
      }
    })

    ws.on('close', () => {
      delete rooms[roomId][userId]
      clients.forEach((client) => {
        if (client !== ws) {
          client.send(JSON.stringify({ type: 'user-disconnected', userId }))
        }
      })
    })
  })
})

const start = async () => {
  await mongoDB(process.env.MONGODB_URI)
  server.listen(3000, () => {
    console.log('server is running on port 3000')
  })
}
start()
