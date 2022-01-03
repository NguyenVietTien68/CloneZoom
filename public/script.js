const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const peer = new Peer(undefined, {
    host: '/',
    port: '3001'
})
const PORTP = 3001;
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    peer.on('call', call => {
        call.answer(stream)
        const v = document.createElement('video')
        call.on('stream', userVideoStream =>{
            addVideoStream(v, userVideoStream) 
        })
    })

    socket.on('user-connected', userId =>{
        connectToNewUser(userId,stream)
    })

})

socket.on('user-disconnected', userId => {
    if(peers[userId])
        peers[userId].close()
})

peer.on('open', id =>{
    socket.emit('join-room', ROOM_ID, id)
})

function addVideoStream(video,stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () =>{
        video.play()
    })
    videoGrid.append(video)
}

function connectToNewUser(userId,stream){
    const call = peer.call(userId,stream)
    const v = document.createElement('video')
    call.on('stream', userVideoStream =>{
        addVideoStream(v, userVideoStream)
    })
    call.on('close',() =>{
        v.remove()
    })
    
    peers[userId] = call
}

peer.Listen(process.env.PORTP || PORTP)