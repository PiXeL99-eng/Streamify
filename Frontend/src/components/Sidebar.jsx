import React, { useState, useRef } from 'react'
import { Container, Box, Button, Stack, HStack, VStack, Input, InputGroup, InputRightAddon, Image, Text, Avatar, Icon, FormLabel, Divider } from '@chakra-ui/react'
import { ArrowDownIcon } from '@chakra-ui/icons'
import { SearchIcon, ChatIcon, RepeatClockIcon } from '@chakra-ui/icons'
import { DashboardImage, Exitmage } from "../assets"
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import { FaVideo, FaUpload } from "react-icons/fa6"
import { useNavigate } from "react-router-dom"
import { startStream } from '../mediaSoupEndPoints'
import { newVideo } from '../api/videoAPICalls'
import { useAuth, useUser } from "@clerk/clerk-react"
import UploadWidget from './UploadWidget'

const Sidebar = (props) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()

    const openPastStreams = () => {
        navigate("/paststreams", { replace: true })
    }

    // {
    //     userName: "Sayantan Kundu", (fullName in clerk)
    //     id: "user_2bgBJk9xMsuP1sMNLMuyoRHu7wd",
    //     userPreviewUrl: "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yYmdCSmt2a2cxWlVYNk1HSGd5c1F6ZzJQaFkifQ" (imageUrl in clerk)
    // 
    // }

    return (
        <>
            <Box width={"20%"} background={"#1f2029"} color={"white"} height={"100%"}>

                <StartNewStreamModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} setProfile={props.setProfile} setViewVideoDetails={props.setViewVideoDetails} />

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

                        <Divider marginY={"2"} />
                            
                        <Box
                            width={"100%"}
                            borderRadius={"7px"}
                            background={"#272831"}
                            padding={"14px"}
                            onClick={() => props.profile === "viewer" ? openPastStreams() : null}
                            _hover={props.profile === "viewer" ? { cursor: "pointer", background: "#303139", color: "#e8e8e8"}: {cursor: "not-allowed"}}
                            border={"1px dashed #b7b7b7"}
                        >
                            View Past Streams &nbsp; <RepeatClockIcon boxSize={"4"} marginBottom={"1"}/>
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

    const videoDesc = useRef()
    const navigate = useNavigate()
    const { userId, getToken } = useAuth()
    const { user } = useUser()
    const [imageUrl, setImageUrl] = useState("")

    const startStreamingFunction = async () => {

        // delay or loading screen

        let roomId = await startStream()

        const videoDetails = {
            videoDesc: videoDesc.current,
            videoUrl: "",
            previewImageUrl: imageUrl,
            live: true,
            roomId: roomId,
            authorId: `${userId}`
        }

        const valid = await newVideo(getToken, videoDetails)

        if (valid) {
            props.onClose()
            props.setProfile("streamer")
            props.setViewVideoDetails({
                videoDesc: videoDesc.current,
                videoUrl: "",
                previewImageUrl: imageUrl,
                author: {
                    userName: user.fullName,
                    userPreviewUrl: user.imageUrl
                }
            })

            navigate("/videopage", { replace: true })
        }
        else {
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

                        <UploadWidget setImageUrl={setImageUrl} />

                        <Box>
                            <FormLabel marginTop={"2"} opacity={"0.7"}>Video Description</FormLabel>
                            <Input
                                size="lg"
                                border="1px solid #4c4c4c"
                                // variant='filled'
                                onChange={event => videoDesc.current = event.currentTarget.value}
                            />

                            <FormLabel marginTop={"2"} opacity={"0.7"}>Uploader Name</FormLabel>
                            <Input
                                size="lg"
                                border="1px solid #4c4c4c"
                                // variant='filled'
                                disabled={true}
                                value={user ? user.fullName : ""}
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