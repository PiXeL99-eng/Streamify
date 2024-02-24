import React, { useState, useEffect, useRef } from 'react'
import { Container, Box, Button, HStack, SimpleGrid, Avatar, VStack, Text, Card, CardHeader, CardBody, CardFooter, Image, Stack, Heading, Divider, ButtonGroup, IconButton, Tooltip, Input, FormLabel } from '@chakra-ui/react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import { consumeStream } from '../mediaSoupEndPoints'
import { useNavigate } from "react-router-dom"
import { BsThreeDotsVertical } from "react-icons/bs";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
} from '@chakra-ui/react'
import { getUserVideos, deleteVideo, updateVideo } from '../api/videoAPICalls';
import UploadWidget from './UploadWidget'
import { useAuth, useUser } from '@clerk/clerk-react';

const AllPastStreamsGrid = (props) => {

    const navigate = useNavigate()
    const [videos, setVideos] = useState([])
    const [modalId, setModalId] = useState("")
    const { userId, isLoaded } = useAuth()
    const { user } = useUser();


    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {

        getUserVideos(userId).then((data) => {
            setVideos(data) 
        })

    }, [userId])

    const playStream = (videoId) => {

        if (props.profile === "streamer") {
            //error handling, can't open video when a streamer
        }
        else {
            navigate("/videopage", { replace: true })
            // fetch the video

        }

    }

    const deleteClickedVideo = (videoId) => {

        deleteVideo(videoId)
        navigate(0)

    }

    const editDesc = (videoId) => {

        setModalId(videoId)
        onOpen()

    }

    // const videos = [
    //     {
    //         image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    //         videoDesc: "42 wins loldfkjbfd",
    //         userID: "codewithharry",
    //         roomID: "166113",
    //         videoID: "1315151"
    //     },
    // ]

    return (
        <>
            <Box padding={"5"} width={"100%"} height={"100%"} overflowY={"auto"}>

                <Text fontSize='lg' marginBottom={"2"}> Your Past Streams ➡</Text>
                <SimpleGrid columns={{ sm: 2, md: 4 }} spacing='40px'>

                    {
                        videos.map((obj, key) => {

                            return (

                                <Box _hover={{ cursor: "pointer", boxShadow: "2px 3px 5px 2px #050505", borderRadius: "6px" }}
                                    position={"relative"}
                                >
                                    {modalId === obj.videoId ?

                                        <EditStreamModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} videoId={obj.videoId} />
                                        :
                                        <></>

                                    }
                                    <Card background={"transparent"}>
                                        <Menu>
                                            <MenuButton
                                                position={"absolute"}
                                                colorScheme='purple'
                                                as={IconButton}
                                                right={"12px"}
                                                top={"12px"}
                                                borderRadius='md'
                                                icon={<BsThreeDotsVertical />}
                                            />
                                            <MenuList bgColor={"#222222"} color={"white"} minW={"11rem"}>
                                                <MenuItem
                                                    bgColor={"#222222"}
                                                    _hover={{ bgColor: "#313131" }}
                                                    onClick={() => editDesc(obj.videoId)}
                                                >
                                                    Edit Description
                                                </MenuItem>

                                                <MenuItem
                                                    bgColor={"#222222"}
                                                    _hover={{ bgColor: "#313131" }}
                                                    onClick={() => deleteClickedVideo(obj.videoId)}
                                                >
                                                    Delete Stream
                                                </MenuItem>
                                                {/* <MenuDivider /> */}
                                            </MenuList>
                                        </Menu>
                                        <CardBody padding={"2"} onClick={() => playStream(obj.videoId)}>

                                            <Box>
                                                <Image
                                                    src={obj.previewImageUrl}
                                                    alt='streamed or streaming video'
                                                    borderRadius='lg'
                                                    height={"11rem"}
                                                    width={"17rem"}
                                                />
                                            </Box>

                                            <HStack width={"100%"} spacing={"3"} mt={"2"}>
                                                <Box>
                                                    <Avatar name='Dan Abrahmov' src={user.imageUrl} boxSize={"10"} />
                                                </Box>

                                                <Box >
                                                    <VStack width={"100%"} alignItems={"left"} spacing={"0"}>

                                                        <Text as={"b"} color={"white"}>{obj.videoDesc}</Text>
                                                        <Text color={"grey"} fontSize={"sm"}>{user.fullName} ☑</Text>

                                                    </VStack>
                                                </Box>
                                            </HStack>
                                        </CardBody>
                                    </Card>
                                </Box>
                            )
                        })
                    }

                </SimpleGrid>
            </Box>
        </>
    )
}

const EditStreamModal = (props) => {

    const videoDesc = useRef()
    const navigate = useNavigate()
    const { userId } = useAuth()
    const { user } = useUser()
    const [imageUrl, setImageUrl] = useState("")

    const submitUpdatedDetails = async () => {

        const videoDetails = {
            videoDesc: videoDesc.current,
            previewImageUrl: imageUrl
        }

        const valid = await updateVideo(props.videoId, videoDetails)

        if (valid) {
            props.onClose()
            navigate(0)
        }
        else {
            //error handling
        }
    }

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent background={"#2d2d2d"} color={"white"} marginTop={"20"} border={"2px solid #ffffff24"}>
                <ModalHeader>Edit your stream details</ModalHeader>
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

                        </Box>
                    </HStack>
                </ModalBody>

                <ModalFooter justifyContent={"center"}>
                    <Button colorScheme='blue' mr={3} onClick={submitUpdatedDetails}>
                        Update ✅
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}


export default AllPastStreamsGrid