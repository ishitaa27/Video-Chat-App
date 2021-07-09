const socket = io('/')

//Create a new Peer
const newPeer = new Peer(undefined, {
  secure: true, 
  host: 'arcane-waters-48936.herokuapp.com', 
  path: '/peerjs',
  port: '443'
})

//Will store the userId of all the users in the room 
const allpeers = {}

//Will store username
const currentUser = prompt("Enter your name")

const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true
let myVideoStream

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {

  //Adding Video Stream of currentUser on the screen
  myVideoStream = stream
  addVideoStream(myVideo, stream)
  
  //Add Video Stream of other users when they join
  newPeer.on('call', (call) => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', (userVideoStream) => {
      addVideoStream(video, userVideoStream)
    })
  })

  //Will call the function connectToNewUser to add a new User to the call
  socket.on('user-connected', userId => {
    setTimeout(connectToNewUser,1000,userId,stream)
  })

  //Variable for input message
  let text = $("input");

  //When enter key is pressed
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      socket.emit('message', text.val(), currentUser)
      text.val('')
    }
  })
  
  //Display message on chat window
  socket.on("createMessage", (message, username) => {
    username === currentUser ? "me" : username
    $("ul").append(`<li class="message"><b>${username}</b></br>${message}</li>`)
    scrollToBottom()
  })

  //When user is disconnected
  socket.on('user-disconnected', userId => {
    if (allpeers[userId]) allpeers[userId].close()
  })

})

//When a new Peer is created
newPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

//Function that will add a new User to the call
function connectToNewUser(userId, stream){
  const call = newPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', (userVideoStream) => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })
  allpeers[userId] = call

}

//Function to add Video Stream on screen
function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}

//Function to make chat window scroll
const scrollToBottom = () => {
  var d = $('.main__chat_window')
  d.scrollTop(d.prop("scrollHeight"))
}

//When Mute/Unmute button is clicked
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false
    setUnmuteButton()
  } 
  else {
    setMuteButton()
    myVideoStream.getAudioTracks()[0].enabled = true
  }
}

//When Camera On/Off Button is clicked
const CameraOnOff = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false
    setCameraOn()
  } 
  else {
    myVideoStream.getVideoTracks()[0].enabled = true
    setCameraOff()
  }
}

//Alter HTML for Mute
const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html
}

//Alter HTML for Unmute
const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html
}

//Alter HTML for Camera On
const setCameraOn = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Camera on</span>
  `
  document.querySelector('.main__video_button').innerHTML = html
}

//Alter HTML for Camera Off
const setCameraOff = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Camera off</span>
  `
  document.querySelector('.main__video_button').innerHTML = html
}

//Invite Others
const InviteButton = document.querySelector("#InviteOthers")
InviteButton.addEventListener("click", (e) => {
  prompt(
    "Use this link to join this meeting",
    window.location.href
  )
})