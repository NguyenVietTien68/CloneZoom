const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
})
const {v4 : uuidV4} = require('uuid')

const PORT = 7000;

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room})
})

const users = {}
// io.on('connection', socket => {
//     console.log(socket.id);
//     const random = Math.floor(Math.random() * Date.now());
//     console.log(random);
//     socket.on('join-room', (name, room) => {
//         console.log("name: " +name,"room: "+room);
//         socket.join(room);
//         users[socket.id] = name;
//         socket.to(room).emit('user-connected', name);
//     })
//     socket.on('send-mess', (mess, room) => {
//         // console.log("Dang gui: "+mess+" toi room " +room);
//         socket.to(room).emit('recive-mess-client', { message: mess, name: users[socket.id] });
//     })
// })

io.on('connection', socket =>{
    socket.on('join-room', (roomId, userId)=>{
        console.log(roomId, userId)
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
})
server.listen(process.env.PORT || PORT,()=>{
    console.log("Server is running on port "+ PORT)
});