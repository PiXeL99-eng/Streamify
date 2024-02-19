import React, { useState } from 'react'
import { Container, Box, Button, HStack, VStack, Image, Text, Center } from '@chakra-ui/react'
import { Navbar, Sidebar, Midbox, StreamChat } from '../components'
import { VideoNotFound } from '../assets'

// Stream Page is a clone of Home page

const VideoPage = (props) => {

    const profile = props.profile
    const setProfile = props.setProfile
    const viewVideoDetails = props.viewVideoDetails
    const setViewVideoDetails = props.setViewVideoDetails

    return (
        <>
            <Box height={"100vh"} w={"100vw"} background={"#181920"} margin={"0"} padding={"0"}>
                <Navbar/>
                < Box width={"100vw"} background={"#181920"} color={"white"} height={"91%"} >

                    {viewVideoDetails.videoDesc === undefined ?

                        <Center height={"100%"}>
                            <VStack spacing={"0"}>
                                <Image src={VideoNotFound} alt='video-not-found' width={"38%"} />
                                <Text fontSize={"lg"}>Video unavailable</Text>
                            </VStack>
                        </Center>

                        :
                        <HStack height={"100%"} spacing={"0"}>

                            <Sidebar profile={profile} setProfile={setProfile} setViewVideoDetails = {setViewVideoDetails}/>
                            <Midbox profile={profile} setProfile={setProfile} viewVideoDetails={viewVideoDetails} />
                            <StreamChat profile={profile}/>

                        </HStack>
                    }

                </Box>
            </Box>
        </>
    )
}

export default VideoPage