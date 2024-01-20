import React from 'react'
import Webcam from "react-webcam"

const VideoCam = (props) => {
  return (
    <>
        <Webcam 
            audio={false}
            width={1280}
            mirrored={true}
            ref={props.webcamRef}
        />
    
    </>
  )
}

export default VideoCam