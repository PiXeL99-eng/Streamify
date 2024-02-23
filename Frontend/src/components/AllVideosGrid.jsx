import React, {useEffect, useState} from 'react'
import { Container, Box, Button, HStack, SimpleGrid, Avatar, VStack, Text, Card, CardHeader, CardBody, CardFooter, Image, Stack, Heading, Divider, ButtonGroup } from '@chakra-ui/react'
import { consumeStream } from '../mediaSoupEndPoints'
import { useNavigate } from "react-router-dom"
import { getAllVideos } from '../api/videoAPICalls'
import { useParams } from "react-router-dom"

const AllVideosGrid = (props) => {

    const navigate = useNavigate()
    const [videos, setVideos] = useState([])
    const { query } = useParams();
    
    const playStream = (obj) => {
        
        // if a user is streaming, do not open let them open viewer page
        // else he is viewer by default, so no problem
        props.setViewVideoDetails({
            videoDesc: obj.videoDesc,
            videoUrl: obj.videoUrl,
            previewImageUrl: obj.previewImageUrl,
            author: obj.author
        })
        
        consumeStream(obj.roomId)
        navigate("/videopage", { replace: true })
        
    }

    useEffect(() => {

        getAllVideos(query).then((data) => {
            data.reverse()
            setVideos(data)
        })

    }, [query])

    // const videos = [
    //     {
    //         image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    //         videoTitle: "42 wins loldfkjbfd",
    //         userID: "codewithharry",
    //         roomID: "166113"
    //     },
    // ]

    return (
        <>
            <Box padding={"5"} width={"100%"} height={"100%"} overflowY={"auto"}>
                <Text fontSize='lg' marginBottom={"2"}> Streams recommended for you ➡</Text>
                <SimpleGrid columns={{ sm: 2, md: 4 }} spacing='40px'>

                    {
                        videos.map((obj, key) => {

                            return (

                                <Box _hover={{cursor: "pointer", boxShadow: "2px 3px 5px 2px #050505", borderRadius: "6px"}} onClick={() => playStream(obj)}>
                                    <Card background={"transparent"}>
                                        <CardBody padding={"2"}>
                                            <Image
                                                src={obj.previewImageUrl}
                                                alt='streamed or streaming video'
                                                borderRadius='lg'
                                                height={"11rem"}
                                                width={"17rem"}
                                            />

                                            <HStack width={"100%"} spacing={"3"} mt={"2"}>
                                                <Box>
                                                    <Avatar name='Dan Abrahmov' src={obj.author.userPreviewUrl} boxSize={"10"} />
                                                </Box>

                                                <Box >
                                                    <VStack width={"100%"} alignItems={"left"} spacing={"0"}>

                                                        <Text as={"b"} color={"white"}>{obj.videoDesc}</Text>
                                                        <Text color={"grey"} fontSize={"sm"}>{obj.author.userName} ☑</Text>

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


export default AllVideosGrid