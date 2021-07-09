const express = require('express')
const app = express()
const server = require('http').Server(app)
const { v4: uuidV4 } = require('uuid')
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
})
const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server, {
  debug: true
})

app.use('/peerjs', peerServer)
app.use(express.static('public'))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)
    socket.on('message', (message, username) => {
      io.to(roomId).emit('createMessage', message, username)
  }) 
  socket.on('disconnect', () => {
    socket.to(roomId).emit('user-disconnected', userId)
  })
  })
})

server.listen(process.env.PORT||4500)