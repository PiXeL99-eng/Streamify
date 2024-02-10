import React, { useState, useEffect } from 'react'
import { Container, Box, Button, HStack, SimpleGrid, Avatar, VStack, Text, Card, CardHeader, CardBody, CardFooter, Image, Stack, Heading, Divider, ButtonGroup, IconButton, Tooltip } from '@chakra-ui/react'
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
import { getUserVideos, deleteVideo } from '../api/videoAPICalls';
import { useAuth, useUser } from '@clerk/clerk-react';

const AllPastStreamsGrid = (props) => {

    const navigate = useNavigate()
    const [videos, setVideos] = useState([])
    const { userId, isLoaded } = useAuth()
    const { user } = useUser();

    useEffect(() => {

        getUserVideos(userId).then((data) => { setVideos(data) })

    }, [userId])

    const playStream = (videoId) => {

        if (props.profile === "streamer"){
            //error handling, can't open video when a streamer
        }
        else{
            navigate("/videopage", { replace: true })
            // fetch the video

        }

    }

    const deleteClickedVideo = (videoId) => {

        deleteVideo(videoId)
        navigate("/paststreams", { replace: true })

    }

    const editDesc = (videoId) => {

        //API to edit desc
        navigate("/paststreams", { replace: true })

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
                                                    src={"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"}
                                                    alt='streamed or streaming video'
                                                    borderRadius='lg'
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


export default AllPastStreamsGrid