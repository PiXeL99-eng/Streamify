import React from 'react'
import { startStream } from '../mediaSoupEndPoints'

const Stream = () => {
    return (
        <>
            <h1>Video Publisher</h1>
            <button id="startStreamBtn" onClick={startStream}>Start Stream</button>
            <div id="localVideoContainer">
                <video id="localVideo" autoPlay = {true} className="video"></video>
            </div>
        </>
    )
}

export default Stream