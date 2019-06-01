import io from "socket.io-client";
const socket = io('http://localhost:4040')

const form = document.querySelector('#user-message')

socket.on('welcome', (message) => {
  console.log(message)
})

socket.on('message', (message) => {
  console.log(message)
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
 const message = e.target.elements.message.value
  socket.emit('clientMessage', message)
})