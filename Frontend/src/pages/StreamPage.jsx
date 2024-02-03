import React from 'react'
import { Container, Box, Button, HStack } from '@chakra-ui/react'
import { Navbar, Sidebar, Midbox, StreamChat } from '../components'

const StreamPage = () => {

    const profile = "viewer" // or viewer
    return (
        <>
            <Box height={"100vh"} w={"100vw"} background={"#181920"} margin={"0"} padding={"0"}>
                <Navbar />
                < Box width={"100vw"} background={"#181920"} color={"white"} height={"91%"} >
                    <HStack height={"100%"} spacing={"0"}>

                        <Sidebar profile = {profile}/>
                        <Midbox profile = {profile}/>
                        <StreamChat />

                    </HStack>
                </Box>
            </Box>
        </>
    )
}

export default StreamPage