import io from "socket.io-client";
const socket = io('http://localhost:4040')
import Mustache from 'mustache';



// DOM elements
const $messageForm = document.querySelector('#user-message')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
// const location_display = document.querySelector('#location-display')
const $shareLocationButton = document.querySelector('#send-location')
const $messages_display = document.querySelector('#messages-display')
const $messages_template = document.querySelector('#messages-template').innerHTML
const $location_messages_template = document.querySelector('#location-messages-template').innerHTML


// Socket.io general messages
socket.on('welcome', (message) => {
  console.log(message)
  const welcomeMessage = Mustache.render($messages_template, {
    message: 'Welcome'
  })
  $messages_display.insertAdjacentHTML('afterbegin', welcomeMessage)
})
socket.on('message', (message) => {
  console.log(message)
  const html = Mustache.render($messages_template, {
    message: message
  })
  $messages_display.insertAdjacentHTML("beforeend", html)
})
socket.on('locationMessage', (url) => {
  console.log("line: ",url)
  const html = Mustache.render($location_messages_template, {
    url: url
  })
  $messages_display.insertAdjacentHTML("beforeend", html)
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
      const html = Mustache.render($messages_template, {
        message: 'Location feature is not supported by your browser.'
      })
      $messages_display.insertAdjacentHTML("beforeend", html)
      // location_display.textContent = 'Location feature is not supported by your browser.'
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