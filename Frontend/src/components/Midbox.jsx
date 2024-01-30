import React from 'react'
import { Container, Box, Button, Stack, HStack, VStack, Input, InputGroup, InputRightAddon, Image, Text, Avatar, Icon } from '@chakra-ui/react'
import { ArrowDownIcon } from '@chakra-ui/icons'
import { DashboardImage, Exitmage } from "../assets"

const Midbox = () => {
    return (
        <>
            <Box width={"60%"} background={"#121212"} color={"white"} height={"100%"}>

                <VStack width={"100%"} height={"100%"} spacing={"0"}>

                    <VideoBox />

                    <Dummy />

                </VStack>


            </Box>
        </>
    )
}

const VideoBox = () => {
    return (
        <>

            <Box width={"100%"} background={"#454a4a"} height={"30rem"}>
                videobox
            </Box>
        </>
    )
}

const Dummy = () => {
    return (
        <>
            <Box width={"100%"} background={"#234d3b"}>
                dummy
            </Box>
        </>
    )
}

export default Midbox