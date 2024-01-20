import React from 'react'
import Webcam from "react-webcam"

const VideoCam = () => {
  return (
    <>
        <Webcam 
            audio={false}
            width={1280}
            mirrored={true}
        />
    
    </>
  )
}

export default VideoCam