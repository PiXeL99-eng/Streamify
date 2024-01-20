import React from 'react'
import { VideoCam } from '../components'
import { Container, Box } from '@chakra-ui/react'

const Home = () => {
    return (
        <>
            <Container height={"100vh"} bg='grey'>
                <Box marginY={"auto"} paddingY={"5"}>
                    <VideoCam />
                </Box>
            </Container>
        </>
    )
}

export default Home