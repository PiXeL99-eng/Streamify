import React, { useState } from 'react'
import { Container, Box, Button, Stack, HStack, VStack, Input, InputGroup, InputRightAddon, Image, Text, Avatar, Icon, FormLabel, Divider } from '@chakra-ui/react'
import { ArrowDownIcon } from '@chakra-ui/icons'
import { SearchIcon, ChatIcon } from '@chakra-ui/icons'
import { DashboardImage, Exitmage } from "../assets"
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import { FaVideo, FaUpload } from "react-icons/fa6"
import { useNavigate } from "react-router-dom"
import { startStream } from '../mediaSoupEndPoints'
import { newVideo } from '../api/videoAPICalls'
import { useAuth } from "@clerk/clerk-react"

const Sidebar = (props) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()

    const openPastStreams = () => {
        navigate("/paststreams", { replace: true })
    }

    return (
        <>
            <Box width={"20%"} background={"#1f2029"} color={"white"} height={"100%"}>

                <StartNewStreamModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} setProfile={props.setProfile} />

                <VStack>

                    <ForYou />

                    <VStack width={"100%"} paddingX={"5"} paddingBottom={"3"} alignItems={"flex-start"}>

                        <Button
                            onClick={onOpen}
                            colorScheme='pink'
                            isDisabled={props.profile === "streamer" ? true : false}
                            variant='outline'
                        >
                            Start New Stream 📽
                        </Button>

                        <Divider marginY={"2"}/>

                        <Box width={"100%"} borderRadius={"7px"} background={"#272831"} padding={"14px"} onClick={openPastStreams} _hover={{cursor: "pointer"}}>
                            View Past Streams
                        </Box>

                    </VStack>


                    <Following />

                    <Recommended />

                </VStack>


            </Box>
        </>
    )
}

const ForYou = () => {
    return (
        <>
            <HStack width={"100%"} justifyContent={"space-between"} paddingX={"5"} paddingBottom={"3"} paddingTop={"5"}>
                <Text fontSize={"xl"} as={"b"}>
                    For you
                </Text>
                <ArrowDownIcon />
            </HStack>
        </>
    )
}

const Following = () => {
    return (
        <>
            <VStack width={"100%"} justifyContent={"space-between"} paddingX={"5"}>
                <Text color={'#9f9f9f'} fontSize={"xs"} as={"b"} width={"100%"} paddingBottom={"10px"}>
                    Following
                </Text>

                <VStack width={"100%"} justifyContent={"space-between"} spacing={"4"}>
                    <HStack width={"100%"} justifyContent={"space-between"} borderRadius={"7px"} background={"#272831"} padding={"8px"}>
                        <Image
                            borderRadius='full'
                            boxSize='32px'
                            src='https://bit.ly/dan-abramov'
                            alt='Dan Abramov'
                        />
                        <Text fontSize={"md"}>
                            codwithharry
                        </Text>
                        <Button background={"#ed4161"} disabled _hover={{ cursor: "default" }} size={"xs"} color={"white"}>
                            LIVE
                        </Button>
                    </HStack>
                    <HStack width={"100%"} justifyContent={"space-between"} borderRadius={"7px"} padding={"8px"}>
                        <Image
                            borderRadius='full'
                            boxSize='32px'
                            src='https://bit.ly/dan-abramov'
                            alt='Dan Abramov'
                        />
                        <Text fontSize={"md"}>
                            dontcodwithharry
                        </Text>
                        <Button background={"transparent"} disabled _hover={{ cursor: "default" }} size={"xs"} color={"transparent"}>
                            LIVE
                        </Button>
                    </HStack>
                </VStack>
            </VStack>
        </>
    )
}

const Recommended = () => {
    return (
        <>
            <VStack width={"100%"} justifyContent={"space-between"} paddingX={"5"} paddingTop={"2"}>
                <Text color={'#9f9f9f'} fontSize={"xs"} as={"b"} width={"100%"} paddingBottom={"10px"}>
                    Recommended
                </Text>

                <VStack width={"100%"}>

                    <HStack width={"100%"} justifyContent={"space-between"} borderRadius={"7px"} padding={"8px"}>
                        <Image
                            borderRadius='full'
                            boxSize='32px'
                            src='https://bit.ly/dan-abramov'
                            alt='Dan Abramov'
                        />
                        <Text fontSize={"md"} width={"80%"} textAlign={"left"}>
                            codwithharry
                        </Text>
                    </HStack>
                    <HStack width={"100%"} justifyContent={"space-between"} borderRadius={"7px"} padding={"8px"}>
                        <Image
                            borderRadius='full'
                            boxSize='32px'
                            src='https://bit.ly/dan-abramov'
                            alt='Dan Abramov'
                        />
                        <Text fontSize={"md"} width={"80%"} textAlign={"left"}>
                            codwithharry
                        </Text>
                    </HStack>
                    <HStack width={"100%"} justifyContent={"space-between"} borderRadius={"7px"} padding={"8px"}>
                        <Image
                            borderRadius='full'
                            boxSize='32px'
                            src='https://bit.ly/dan-abramov'
                            alt='Dan Abramov'
                        />
                        <Text fontSize={"md"} width={"80%"} textAlign={"left"}>
                            codwithharry
                        </Text>
                    </HStack>

                </VStack>
            </VStack>
        </>
    )
}

const StartNewStreamModal = (props) => {

    const [videoDesc, setVideoDesc] = useState("")
    const navigate = useNavigate()
    const { userId } = useAuth()

    const startStreamingFunction = async () => {

        //API call to create new room
        // delay or loading screen

        let roomId = await startStream()
        roomId = "0c599d99-ec66-432e-b5fa-ebca022d654e"

        const videoDetails = {
            videoDesc: videoDesc,
            videoUrl: "",
            previewImageUrl: "yahoo.com",
            live: true,
            roomId: roomId,
            userId: `${userId}`
        }

        const valid = await newVideo(videoDetails)

        if (valid){
            navigate("/videopage", {replace: true})
            props.onClose()
            props.setProfile("streamer")
        }
        else{
            //error handling
        }
    }

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent background={"#2d2d2d"} color={"white"} marginTop={"20"} border={"2px solid #ffffff24"}>
                <ModalHeader>Your Stream Details</ModalHeader>
                <ModalCloseButton />
                <ModalBody>

                    <HStack spacing={"5"}>

                        <Box>
                            <FormLabel opacity={"0.7"}>Preview Image</FormLabel>

                            <Image src='https://bit.ly/dan-abramov' alt='Dan Abramov' />

                        </Box>

                        <Box>
                            <FormLabel marginTop={"2"} opacity={"0.7"}>Video Description</FormLabel>
                            <Input
                                size="lg"
                                border="1px solid #4c4c4c"
                                // variant='filled'
                                onChange={event => setVideoDesc(event.currentTarget.value)}
                            />

                            <HStack spacing={"4"} marginTop={"4"}>
                                <Box border={"2px solid transparent"} borderRadius={"5"} background={"#33763c"} padding={"1.5"}><FaUpload size={"28"} /></Box>
                                <Box border={"2px solid transparent"} borderRadius={"5"} background={"#33763c"} padding={"1.5"}><ChatIcon boxSize={"7"} /></Box>
                                <Box border={"2px solid transparent"} borderRadius={"5"} background={"#33763c"} padding={"1.5"}><FaVideo size={"28"} /></Box>
                            </HStack>
                        </Box>
                    </HStack>
                </ModalBody>

                <ModalFooter justifyContent={"center"}>
                    <Button colorScheme='blue' mr={3} onClick={startStreamingFunction}>
                        Start Stream ▶
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default Sidebar