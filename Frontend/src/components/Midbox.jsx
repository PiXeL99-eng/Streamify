import React, { useRef, useState, useEffect } from 'react'
import { Container, Box, Button, Stack, HStack, VStack, Input, InputGroup, InputRightAddon, Image, Text, Avatar, Icon } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { DashboardImage, Exitmage } from "../assets"
import StreamingBox from "./StreamingBox"
import { stopStream } from '../mediaSoupEndPoints'
import { useNavigate } from 'react-router-dom'

const Midbox = (props) => {

    return (
        <>
            <Box width={"60%"} background={"#121212"} color={"white"} height={"100%"} overflowY={"auto"}>

                <VStack width={"100%"} minHeight={"100%"} spacing={"0"}>

                    {props.profile === "streamer" ?
                        <StreamControl setProfile={props.setProfile} /> : <></>
                    }

                    <VideoBox profile={props.profile} />

                    <VStack padding={"4"} width={"100%"}>

                        <VideoDesc viewVideoDetails={props.viewVideoDetails} />

                        {props.profile === "streamer" ?
                            <EditVideoDesc /> : <></>
                        }

                    </VStack>



                </VStack>


            </Box>
        </>
    )
}

const VideoBox = (props) => {
    return (
        <>

            {props.profile === "streamer" ?

                <Box width={"100%"} background={"#454a4a"} height={"32.4rem"} position={"relative"}>
                    <video id="localVideo" autoPlay={true} className="video"></video>
                    <video id="screenShareVideo" autoPlay={true} className="video"></video>
                </Box>
                :
                <Box width={"100%"} background={"#454a4a"} height={"32.4rem"} position={"relative"}>
                    <video id="remoteScreenShareVideo" autoPlay={true} className="video"></video>
                    <audio id="remoteScreenShareAudio" autoPlay={true}></audio>
                    <video id="remoteVideo" autoPlay={true} className="video"></video>
                    <audio id="remoteAudio" autoPlay={true}></audio>
                </Box>
            }
        </>
    )
}

const StreamControl = (props) => {

    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    console.log("hi")

    const formatTime = (timer) => {
        const hours = Math.floor(timer / 360000).toString().padStart(2, "0");
        const minutes = Math.floor((timer % 360000) / 6000).toString().padStart(2, "0");
        const seconds = Math.floor((timer % 6000) / 100).toString().padStart(2, "0");
        const milliseconds = (timer % 100).toString().padStart(2, "0");

        return { hours, minutes, seconds, milliseconds };
    };

    const { hours, minutes, seconds, milliseconds } = formatTime(timer);

    // const handleStart = () => {
    //     timeInterval.current = setInterval(() => {
    //         setTimer((prev) => prev + 1);
    //     }, 10);
    // };

    useEffect(() => {
        let intervalId;
        if (isRunning) {
          // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
        intervalId = setInterval(() => setTimer(timer + 1), 7);
        }
        return () => clearInterval(intervalId);
      }, [isRunning, timer]);
      
    const handleStop = () => {
        setIsRunning(false)
    };

    const navigate = useNavigate()
    const stopStreaming = () => {

        //API call happens within stopStream()
        //delay
        handleStop()
        stopStream()
        props.setProfile("viewer")
        navigate("/allvideos", { replace: true })

    }


    return (
        <>
            <Box width={"100%"}>
                <Box background={"#454545d1"} paddingY={"1.5"} paddingX={"4"} margin={"3"} borderRadius={"5"}>

                    <HStack width={"100%"}>
                        <Box width={"75%"}>

                            Streaming Since: &nbsp;
                            {hours}:
                            {minutes}:
                            {seconds}
                        </Box>

                        <Box width={"25%"} alignContent={"center"}>
                            <Button width={"100%"} rightIcon={<CloseIcon ml={"1"} fontSize={"13"} />} colorScheme='red' variant='solid' isLoading={false} loadingText='Stopping' spinnerPlacement='end' onClick={stopStreaming}>
                                Stop Streaming
                            </Button>
                        </Box>

                    </HStack>

                </Box>
            </Box>
        </>
    )
}

const VideoDesc = (props) => {

    return (

        <HStack width={"100%"} spacing={"3"}>
            <Box>
                <Avatar name='Dan Abrahmov' src={props.viewVideoDetails.author.userPreviewUrl} boxSize={"16"} />
            </Box>

            <Box >
                <VStack width={"100%"} alignItems={"left"} spacing={"1"}>

                    <Text as={"b"}>{props.viewVideoDetails.author.userName} ☑</Text>
                    <Text>{props.viewVideoDetails.videoDesc}</Text>
                    <Text color={"red"} id='viewersCount'>👀 0 viewers</Text>

                </VStack>
            </Box>
        </HStack>


    )

}

const EditVideoDesc = () => {

    return (

        <>
            Edit Video Desc
        </>

    )

}

export default Midbox