import React, { useContext, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { SocketContext } from "../SocketContext";

const Notification = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);
  console.log(call.isReceivedCall);
  console.log(callAccepted);

  return (
    <>
      {call.isReceivedCall && !callAccepted && (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <h1>{call.name} is calling:</h1>
          <Button variant="contained" color="primary" onClick={answerCall}>
            Answer
          </Button>
        </div>
      )}
   
  
    </>
  );
};

export default Notification;