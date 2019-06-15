import io from "socket.io-client";
const socket = io('http://localhost:4040')
import Mustache from 'mustache';
import { getDate } from '../src/utils/getDate';


// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// DOM elements
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------

// Elements
const $messageForm = document.querySelector('#user-message')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $shareLocationButton = document.querySelector('#send-location')
const $messages_display = document.querySelector('#messages-display')

// Templates
const $messages_template = document.querySelector('#messages-template').innerHTML
const $location_messages_template = document.querySelector('#location-messages-template').innerHTML

// Parsing URL Options
let url = location.search
url = url.slice(1)
let queryArray = url.split('&')
let queryObject = {}
queryArray.map(each => {
  const splitted = each.split('=')
  queryObject[splitted[0]] = splitted[1]
})
const { username, room } = queryObject

// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// Socket.io general messages
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------

socket.on('welcome', (message) => {
  console.log(message)
  const welcomeMessage = Mustache.render($messages_template, {
    message: 'Welcome',
    createdAt: getDate()
  })
  $messages_display.insertAdjacentHTML('afterbegin', welcomeMessage)
})
socket.on('message', ({message, createdAt}) => {
  console.log(message)
  const html = Mustache.render($messages_template, {
    message: message,
    createdAt
  })
  $messages_display.insertAdjacentHTML("beforeend", html)
})
socket.on('locationMessage', ({url, createdAt}) => {
  console.log("line: ", url)
  const html = Mustache.render($location_messages_template, {
    url: url,
    createdAt
  })
  $messages_display.insertAdjacentHTML("beforeend", html)
})

// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// handle sending user messages to server to be sent to other clients
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()

  // disable button after sending message -- being re-enabled after 
  // message delivered 
  $messageFormButton.setAttribute('disabled', 'disabled')

  const message = e.target.elements.message.value
  const createdAt = getDate()
  socket.emit('clientMessage', {message, createdAt}, (error) => {
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

// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// Location Share
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------

$shareLocationButton
  .addEventListener('click', () => {

    if (!navigator.geolocation) {
      const html = Mustache.render($messages_template, {
        message: 'Location feature is not supported by your browser.'
      })
      $messages_display.insertAdjacentHTML("beforeend", html)
      return undefined
    }

    // disable send location after user send location -- will be 
    // enabled after response received
    $shareLocationButton.setAttribute('disabled', 'disabled')

    const createdAt = getDate()
    navigator.geolocation.getCurrentPosition(position => {
      socket.emit('sendLocation', {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
        createdAt: createdAt
      }, () => {
        $shareLocationButton.removeAttribute('disabled')
        console.log('Location Shared!')
      })
    })
  })
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// Joining to a specific room
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
socket.emit('join', {username, room})