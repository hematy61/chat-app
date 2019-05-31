import io from "socket.io-client";
const socket = io('http://localhost:4040')

const form = document.querySelector('#user-message')

socket.on('welcome', (message) => {
  console.log(message)
})

socket.on('userMessageFromServer', (message) => {
  console.log(message)
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
  console.log(e.target.elements)
 const message = e.target.elements.message.value
  socket.emit('userMessage', message)
})