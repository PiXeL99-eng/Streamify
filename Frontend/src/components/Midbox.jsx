import React, { useRef, useState, useEffect } from 'react'
import { Container, Box, Button, Stack, HStack, VStack, Input, InputGroup, InputRightAddon, Image, Text, Avatar, Icon } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import { DashboardImage, Exitmage } from "../assets"
import { stopStream } from '../mediaSoupEndPoints'
import { useNavigate } from 'react-router-dom'

const Midbox = (props) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isRunning, setIsRunning] = useState(props.profile === "streamer" ? true : false);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (props.profile === "streamer") {
                event.preventDefault()
                event.returnValue = ''
                onOpen()
                return ''
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isRunning]);

    const navigate = useNavigate()
    const stopStreaming = () => {

        stopStream()
        onClose()
        setIsRunning(false)        
        props.setProfile("viewer")
        navigate("/allvideos", { replace: true })

    }

    return (
        <>
            <Box width={"60%"} background={"#121212"} color={"white"} height={"100%"} overflowY={"auto"}>

                {props.profile === "streamer" ?
                    <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent background={"#2d2d2d"} color={"white"} marginTop={"20"} border={"2px solid #ffffff24"}>
                            <ModalHeader>Do you want to stop streaming?</ModalHeader>
                            <ModalCloseButton />
                            <ModalFooter justifyContent={"center"}>
                                <HStack>
                                    <Button colorScheme='red' mr={3} onClick={stopStreaming}>
                                        Stop Streaming ❌
                                    </Button>
                                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                                        Continue Streaming ✔
                                    </Button>
                                </HStack>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    :
                    <></>
                }

                <VStack width={"100%"} minHeight={"100%"} spacing={"0"}>

                    {props.profile === "streamer" ?
                        <StreamControl stopStreaming={stopStreaming} isRunning={isRunning}/> : <></>
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
        if (props.isRunning) {
            // setting time from 0 to 1 every 7 milisecond using javascript setInterval method
            intervalId = setInterval(() => setTimer(timer + 1), 7);
        }
        return () => clearInterval(intervalId);
    }, [props.isRunning, timer]);

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
                            <Button
                                width={"100%"}
                                rightIcon={<CloseIcon ml={"1"} fontSize={"13"} />}
                                colorScheme='red'
                                variant='solid'
                                isLoading={false}
                                loadingText='Stopping'
                                spinnerPlacement='end'
                                onClick={props.stopStreaming}
                            >
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