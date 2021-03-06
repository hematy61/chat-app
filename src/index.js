const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
// express by default makes a server for us which we don't have access to that. 
// we need to have access to this server to be able to run socket.io on this server.
// By creating const server = http.createServer(app), we now have server in common 
// between express and socket.io
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT

// define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')

// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// on connection
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
let message = "welcome!"
io.on('connection', (socket) => {
  console.log('New websocket connection')
  socket.emit('welcome', message)
  socket.broadcast.emit('message', 'A new user has joined!')

  // -------------------------------------------
  // Receiving Messages from Client
  // -------------------------------------------
  socket.on('clientMessage', ({message, createdAt}, callback) => {
    const filter = new Filter()
    if (filter.isProfane(message)) {
     return callback('Message contains Profanity and can not be sent!')
    }
    io.emit('message', {message, createdAt})
    callback()
  })
  // -------------------------------------------
  // Location
  // -------------------------------------------
  socket.on('sendLocation', (coords, callback) => {
    const createdAt = coords.createdAt
    const url = `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
    io.emit('locationMessage', {url, createdAt})
    callback()
  })

  // -------------------------------------------
  // Client Disconnection
  // -------------------------------------------
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left!')
  })
})


/*******************************************************************
 ***************** home route **************************************
 *******************************************************************/
app.use(express.static(publicDirectoryPath))
app.get('', (req, res) => {
  res.render('index')
})


/*******************************************************************
 ***************** listener ****************************************
 *******************************************************************/
server.listen(port, () => {
  console.log(`server is running on port ${port}`)
})