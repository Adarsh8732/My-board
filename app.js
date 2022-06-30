let express = require('express');
const socket = require("socket.io");

const app = express();

app.use(express.static("public"));

let port = process.env.PORT || 5000;

let server = app.listen(port,()=>{
    console.log("Listening to port"+port);
})

let io = socket(server,{
    cors: {
        origin: "http://localhost:5000",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});


io.on("connection",(socket)=>{
    console.log("connection made");
    socket.on("beginPath",(data)=>{
        // console.log("beginpath in app.js")
        io.sockets.emit("beginPath",data);
    })
    socket.on("drawStroke",(data)=>{
        io.sockets.emit("drawStroke",data);
    })
    socket.on("redoUndo",(data)=>{
        io.sockets.emit("redoUndo",data);
    })
})