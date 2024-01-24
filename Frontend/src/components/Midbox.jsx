import React from 'react'
import { Container, Box, Button, Stack, HStack, VStack, Input, InputGroup, InputRightAddon, Image, Text, Avatar, Icon } from '@chakra-ui/react'
import { ArrowDownIcon } from '@chakra-ui/icons'
import { DashboardImage, Exitmage } from "../assets"

const Midbox = () => {
    return (
        <>
            <Box width={"60%"} background={"#121212"} color={"white"} height={"100%"}>

                <VStack>

                    <VideoBox />

                    <Dummy/>

                </VStack>


            </Box>
        </>
    )
}

const VideoBox = () => {
    return (
        <>
          Box
        </>
    )
}

const Dummy = () => {
    return (
        <>
        Dummy
        </>
    )
}

export default Midbox