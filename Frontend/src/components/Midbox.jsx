import React from 'react'
import { Container, Box, Button, Stack, HStack, VStack, Input, InputGroup, InputRightAddon, Image, Text, Avatar, Icon } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { DashboardImage, Exitmage } from "../assets"
import StreamingBox from "./StreamingBox"

const Midbox = (props) => {
    return (
        <>
            <Box width={"60%"} background={"#121212"} color={"white"} height={"100%"}>

                <VStack width={"100%"} height={"100%"} spacing={"0"}>

                    {props.profile === "streamer" ?
                        <StreamControl /> : <></>
                    }

                    <Box width={"100%"} background={"#454a4a"} height={"29rem"} position={"relative"}>

                        {props.profile === "streamer" ?
                            <StreamingBox /> : <VideoBox />
                        }

                    </Box>

                    <VStack padding={"4"} width={"100%"}>

                        <VideoDesc profile={props.profile} />

                        {props.profile === "streamer" ?
                            <EditVideoDesc /> : <></>
                        }

                    </VStack>



                </VStack>


            </Box>
        </>
    )
}

const VideoBox = () => {
    return (
        <>
            <video id="remoteVideo" autoPlay = {true} className="video"></video>
        </>
    )
}

const StreamControl = () => {
    return (
        <>
            <Box width={"100%"}>
                <Box background={"#454545d1"} paddingY={"1.5"} paddingX={"4"} margin={"3"} borderRadius={"5"}>

                    <HStack width={"100%"}>
                        <Box width={"75%"}>

                            Streaming Since: <span>00:00:05</span>
                        </Box>

                        <Box width={"25%"} alignContent={"center"}>
                            <Button width={"100%"} rightIcon={<CloseIcon ml={"1"} fontSize={"13"} />} colorScheme='red' variant='solid' isLoading={false} loadingText='Stopping' spinnerPlacement='end'>
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
                <Avatar name='Dan Abrahmov' src='https://bit.ly/dan-abramov' boxSize={"16"}/>
            </Box>

            <Box >
                <VStack width={"100%"} alignItems={"left"} spacing={"1"}>

                    <Text as={"b"}>codewithharry ☑</Text>
                    <Text>42 wins loldfkjbfdkbkskjsbkbks kskbs ks kshks</Text>
                    <Text color={"red"}>👀 2 viewers</Text>

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