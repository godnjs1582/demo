const app =require("express")();
const server=require("http").createServer(app);
const cors=require("cors");
// const { isTypedArray } = require("util/types");

const io =require("socket.io")(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});

app.use(cors());

const PORT =process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.send("running");
});


io.on('connection',(socket)=>{
    socket.emit('me',socket.id);
    socket.on('disconnet',()=>{
        socket.broadcast.emit('callended');
    });
    socket.on('calluser',({userToCall,signalData,from,name})=>{
        io.to(userToCall).emit('calluser',{signal:signalData,from,name});
        console.log("데이터 전송중");
    });
    socket.on("answercall",(data)=>{
        io.to(data.to).emit('callaccepted',data.signal);
    })
});
server.listen(PORT,()=>console.log(`server listening on port sdfsdfsdf${PORT}`));