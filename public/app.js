import io from "socket.io-client";
const socket = io('http://localhost:4040')


// DOM elements
const $messageForm = document.querySelector('#user-message')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const location_display = document.querySelector('#location-display')
const $shareLocationButton = document.querySelector('#send-location')

// Socket.io genereal messages
socket.on('welcome', (message) => {
  console.log(message)
})
socket.on('message', (message) => {
  console.log(message)
})

// handle sending user messages to server to be sent to other clients
$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()

  // disable button after sending message -- being re-enabled after 
  // message delivered 
  $messageFormButton.setAttribute('disabled', 'disabled')

  const message = e.target.elements.message.value

  socket.emit('clientMessage', message, (error) => {
    // re-enable send message button as message delivered
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()

    if (error) {
      return console.log(error)
    }

    console.log('Message Delivered!')
  })
})

// handle sharing user location
$shareLocationButton
  .addEventListener('click', () => {

    if (!navigator.geolocation) {
      location_display.textContent = 'Location feature is not supported by your browser.'
      return undefined
    }
    
    // disable send location after user send location -- will be 
    // enabled after response received
    $shareLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition(position => {
      socket.emit('sendLocation', {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
        time: position.timestamp
      }, () => {
        $shareLocationButton.removeAttribute('disabled')
        console.log('Location Shared!')
      })
    })
  })