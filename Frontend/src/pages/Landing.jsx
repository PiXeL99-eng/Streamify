import React from 'react'
import { Container, Box, Button, HStack } from '@chakra-ui/react'
import { Navbar, Sidebar, Midbox, StreamChat } from '../components'

const Landing = () => {
    return (
        <>
            <Box height={"100vh"} w={"100vw"} background={"#181920"} margin={"0"} padding={"0"}>
                <Navbar />
                < Box width={"100vw"} background={"#181920"} color={"white"} height={"91%"} >
                    <HStack height={"100%"} spacing={"0"}>

                        <Sidebar />
                        <Midbox />
                        <StreamChat />

                    </HStack>
                </Box>
            </Box>
        </>
    )
}

export default Landing