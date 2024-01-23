import React from 'react'
import { Container, Box, Button } from '@chakra-ui/react'
import { Navbar } from '../components'

const Landing = () => {
    return (
        <>
            <Box height={"100vh"} w={"100vw"} background={"red"} margin={"0"} padding={"0"}>
                <Navbar></Navbar>
            </Box>
        </>
    )
}

export default Landing