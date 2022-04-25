import React,{createContext,useState,useRef,useEffect} from 'react';
import {io} from "socket.io-client";
import Peer from 'simple-peer';


const SocketContext =createContext();

const socket= io('http://localhost:5000'); //이 주소를 통해 서버와 연결을 한다

const ContextProvider =({children})=>{
    const [callAccepted,setCallAccepted]=useState(false);
    const [callEndend,setCallEnded]=useState(false);
    const [stream,setStream]=useState();
    const [name,setName]=useState('');
    const [call,setCall]=useState({});
    const [me,setMe]=useState('');

    const myVideo =useRef(null);
    const userVideo =useRef();
    const connectionRef =useRef();

    useEffect(()=>{
        const getUserMedia=async ()=>{
            try {
                const currentstream =await navigator.mediaDevices.getUserMedia({video:true,audio:true});
                setStream(currentstream)
                myVideo.current.srcObject=currentstream;
            }catch(err){
                console.log(err)
            }
        };
        getUserMedia();
        socket.on('me',(id)=>setMe(id));
        socket.on('calluser',({from,name:callerName,signal})=>{
            setCall({isReceivedCall:true,from,name:callerName,signal});
        });
    },[]);//useEffet가 항상 실행되는 것을 방지하기 위해 뒤에 빈배열을 반드시 추가해 놓아야 함

    const answerCall=()=>{
        setCallAccepted(true)
        const peer =new Peer({initiator:false, trickle:false, stream});

        peer.on('signal',(data)=>{
            socket.emit('answercall',{signal:data,to:call.from});
        });
        peer.on('stream',(currentStream)=>{
            userVideo.current.srcObject=currentStream;
        });
        peer.signal(call.signal);

        connectionRef.current =peer;
    };

    const callUser=(id)=>{
        const peer =new Peer({initiator:true,trickle:false,stream});
        peer.on('signal',(data)=>{
            console.log(data,me,name);
            socket.emit('calluser',{userToCall:id,signalData:data,from:me,name});
        });
        peer.on('stream',(currentStream)=>{
            userVideo.current.srcObject=currentStream;
        });
        socket.on('callaccepted',(signal)=>{
            setCallAccepted(true);
            peer.signal(signal);
        });
        connectionRef.current = peer;
        console.log("실행되니?");

    }
    const leaveCall=()=>{
        setCallEnded(true);
        connectionRef.current.destroy();
        window.location.reload();
    }
    return (
        <SocketContext.Provider value={{
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            setName,
            name,
            callEndend,
            me,
            callUser,
            leaveCall,
            answerCall,
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export {ContextProvider,SocketContext};