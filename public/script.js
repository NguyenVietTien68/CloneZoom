// const socket = io('/')
// const videoGrid = document.getElementById('video-grid')
// const peer = new Peer()
// const myVideo = document.createElement('video')
// myVideo.muted = true
// const peers = {}
const mic = document.getElementById('micCfg')
const camera = document.getElementById('videoCfg')

// let playMic = false;
// let playVideo = false;

// navigator.getUserMedia = ( navigator.getUserMedia ||
//     navigator.webkitGetUserMedia ||
//     navigator.mozGetUserMedia ||
//     navigator.msGetUserMedia);

// navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true
// }).then(stream => {
//     addVideoStream(myVideo, stream)
//     peer.on('call', call => {
//         call.answer(stream)
//         const v = document.createElement('video')
//         const vb = document.createElement('button')
//         call.on('stream', userVideoStream =>{
//             addVideoStream(v, userVideoStream)

//         })
//     })

//     socket.on('user-connected', userId =>{
//         connectToNewUser(userId,stream)
//     })

// })

// socket.on('user-disconnected', userId => {
//     if(peers[userId])
//         peers[userId].close()
// })

// peer.on('open', id =>{
//     socket.emit('join-room', ROOM_ID, id)
// })

// function addVideoStream(video,stream){
//     playMic = true;
//     playVideo = true;
//     video.srcObject = stream
//     video.addEventListener('loadedmetadata', () =>{
//         video.play()
//     })
//     videoGrid.append(video)
// }

// function connectToNewUser(userId,stream){
//     const call = peer.call(userId,stream)
//     const v = document.createElement('video')
//     call.on('stream', userVideoStream =>{
//         addVideoStream(v, userVideoStream)
//     })
//     call.on('close',() =>{
//         v.remove()
//     })
//     peers[userId] = call
// }

const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const peer = new Peer()
const myVideo = document.createElement('video')
myVideo.muted = true
let userStream;
let isAudio;
let isVideo;
let localStream;
const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)
    isAudio = true;
    isVideo = true;
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
    localStream = stream
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
let mic_switch = true;
let video_switch = true;

function toggleVideo() {
    navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
    })
}

function toggleMic() {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    })
}    

mic.addEventListener('click', function(e){
    e.preventDefault();
    console.log('Mic')
    // const videoTrack = userStream.getTracks().find(track => track.kind === 'video');
    // if (videoTrack.enabled) {
    //     videoTrack.enabled = false;
    // } else {
    //     videoTrack.enabled = true;
    // }
    if(isAudio == true){
        isAudio = false;
        localStream.getAudioTracks()[0].enabled = false;
    }else{
        isAudio = true;
        localStream.getAudioTracks()[0].enabled = true;
    }
})

camera.addEventListener('click', function(e){
    e.preventDefault();
    console.log('Camera')
    // const videoTrack = userStream.getTracks().find(track => track.kind === 'video');
    // if (videoTrack.enabled) {
    //     videoTrack.enabled = false;
    // } else {
    //     videoTrack.enabled = true;
    // }
    if(isVideo == true){
        isVideo = false;
        console.log(isVideo);

        localStream.getVideoTracks()[0].enabled = false;
    }else{
        isVideo = true;
        console.log(isVideo);
        localStream.getVideoTracks()[0].enabled = true;
    }
})