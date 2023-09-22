document.addEventListener('DOMContentLoaded', () => {
  const videoGrid = document.getElementById('video-grid')
  console.log(videoGrid)
  const ROOM_ID = videoGrid.getAttribute('data-room-id')
  const myPeer = new Peer()
  const myVideo = document.createElement('video')
  myVideo.muted = true
  const peers = {}

  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      addVideoStream(myVideo, stream)

      myPeer.on('call', (call) => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', (userVideoStream) => {
          addVideoStream(video, userVideoStream)
        })
      })

      myPeer.on('open', (id) => {
        const data = {
          roomId: ROOM_ID,
          userId: id,
        }
        const ws = new WebSocket(`ws://localhost:3000`)
        ws.onopen = () => {
          ws.send(JSON.stringify(data))
        }
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data)
          if (data.type === 'user-connected') {
            connectToNewUser(data.userId, stream)
          } else if (data.type === 'user-disconnected') {
            if (peers[data.userId]) {
              peers[data.userId].close()
            }
          }
        }
      })
    })

  function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', (userVideoStream) => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      video.remove()
    })

    peers[userId] = call
  }

  function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    videoGrid.append(video)
  }
})
