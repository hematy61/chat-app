import io from "socket.io-client";
const socket = io('http://localhost:4040')

const form = document.querySelector('#user-message')
const location_display = document.querySelector('#location-display')

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

document.querySelector('#send-location')
  .addEventListener('click', () => {
    if (!navigator.geolocation) {
      location_display.textContent = 'Location feature is not supported by your browser.'
      return undefined
    }
    navigator.geolocation.getCurrentPosition(position => {
      socket.emit('sendLocation',
      {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
        time: position.timestamp
      })
    })
  })