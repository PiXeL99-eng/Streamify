import React, {useState} from 'react'
import consumeStream from '../mediaSoupEndPoints/consumer'

const Consume = () => {

    const [inputRoomID, setInputRoomID] = useState('')

    return (
        <>

            <h1>Video Consumer</h1>
            <label htmlFor="roomIdInput">Enter Room ID:</label>
            <input type="text" id="roomIdInput" placeholder="Enter Room ID" onChange={event => setInputRoomID(event.currentTarget.value)}/>
            <button id="consumeBtn" onClick={() => {consumeStream(inputRoomID)}}>Consume</button>
            <div id="remoteVideoContainer">
                <video id="remoteVideo" autoPlay = {true} className="video"></video>
            </div>
        </>
    )
}

export default Consume