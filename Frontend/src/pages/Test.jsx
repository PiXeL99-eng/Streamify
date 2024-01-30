import React, {useRef} from 'react'
import { VideoCam } from '../components'
import { Container, Box, Button } from '@chakra-ui/react'

const Test = () => {

    const webcamRef = useRef(null)

    const startStream = async () => {

        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        // console.log(webcamRef.current)
        console.log(videoStream)

    }

    return (
        <>
            <Container height={"100vh"} bg='grey'>
                <Box marginY={"auto"} paddingY={"5"}>
                    <VideoCam webcamRef={webcamRef}/>
                </Box>

                <Button colorScheme='blue' onClick={startStream}>Stream</Button>
            </Container>
        </>
    )
}

export default Test