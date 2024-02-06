import React, {useState} from 'react'
import { Container, Box, Button, Stack, HStack, VStack, Input, InputGroup, InputRightAddon, Image, Text, Avatar, FormLabel } from '@chakra-ui/react'
import { SearchIcon, ChatIcon } from '@chakra-ui/icons'
import { DashboardImage, Exitmage } from "../assets"
import { UserButton } from '@clerk/clerk-react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import { FaVideo, FaUpload } from "react-icons/fa6"
import { useNavigate } from "react-router-dom"
import { startStream } from '../mediaSoupEndPoints'

const Navbar = (props) => {

    return (
        <>
            <Box width={"100vw"} background={"#252630"} color={"white"} height={"9%"}>

                <HStack height={"16"} alignContent={"center"} justifyItems={"center"} justifyContent={"space-between"}>

                    <LeftCornerNavbar />

                    <SearchBox />

                    <RightCornerNavbar profile={props.profile} setProfile={props.setProfile}/>

                </HStack>

            </Box>
        </>
    )
}

const SearchBox = () => {

    const runSearch = () => {
        console.log("searched")
    }

    return (
        <>
            <Box width={"24%"}>
                <InputGroup size='md' border={"transparent"}>
                    <Input placeholder='Search' background={"#1f2029"} color={"white"} borderRadius={"3px 3px 3px 3px"} />
                    <InputRightAddon background={"transparent"} onClick={runSearch} _hover={{ cursor: "pointer" }} backgroundColor={"#323232cf"}>
                        <SearchIcon />
                    </InputRightAddon>
                </InputGroup>
            </Box>
        </>
    )
}

const LeftCornerNavbar = () => {
    return (
        <>
            <Box width={"10%"} marginLeft={"8"}>
                <HStack spacing={"3"}>
                    <Image
                        borderRadius='full'
                        boxSize='45px'
                        src='https://bit.ly/dan-abramov'
                        alt='Dan Abramov'
                    />
                    <VStack spacing={"0"} alignItems={"left"}>
                        <Text fontSize='lg' as={"b"}>Streamify</Text>
                        <Text fontSize={"12px"}>Let's Play</Text>
                        {/* OR  */}
                        {/* <Text fontSize={"12px"}>Creator Dashboard</Text>       */}
                    </VStack>
                </HStack>
            </Box>
        </>
    )
}

const RightCornerNavbar = (props) => {

    const navigate = useNavigate()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const showAllVideos = () => {
        navigate("/allvideos", { replace: true })
    }

    return (
        <>

            <StartNewStreamModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} setProfile={props.setProfile}/>

            <Box width={"12%"} marginRight={"2"}>
                <HStack spacing={"0"} justifyContent={"space-around"}>
                    <HStack spacing={"2"} _hover={{ cursor: "pointer" }} onClick={showAllVideos}>
                        {/* <Button 
                        onClick={onOpen}
                        isDisabled={props.profile === "streamer" ? true : false}
                        >
                            Start Streaming
                        </Button> */}
                        <Image
                            boxSize='22px'
                            src={DashboardImage}
                            alt='Dashboard-Image'
                        />

                        <Text fontSize='md'>Watch</Text>
                    </HStack>
                    <UserButton afterSignOutUrl='/' />
                    {/* <Avatar boxSize={"9"} name='Kola Tioluwani' src='https://bit.ly/tioluwani-kolawole' /> */}
                </HStack>
            </Box>
        </>
    )
}

const StartNewStreamModal = (props) => {

    const [videoTitle, setVideoTitle] = useState("")
    const [videoDescription, setVideoDescription] = useState("")

    const startStreamingFunction = () => {

        //API call to create new room
        // delay or loading screen
        props.setProfile("streamer")
        startStream()
        props.onClose()
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
                            <FormLabel opacity={"0.7"}>Video Title</FormLabel>
                            <Input
                                size="md"
                                border="1px solid #4c4c4c"
                                onChange={event => setVideoTitle(event.currentTarget.value)}
                                // variant='filled'
                            />
                            <FormLabel marginTop={"2"} opacity={"0.7"}>Video Description</FormLabel>
                            <Input
                                size="lg"
                                border="1px solid #4c4c4c"
                                // variant='filled'
                                onChange={event => setVideoDescription(event.currentTarget.value)}
                            />

                            <HStack spacing={"4"} marginTop={"4"}>
                                <Box border={"2px solid transparent"} borderRadius={"5"} background={"#33763c"} padding={"1.5"}><FaUpload size={"28"}/></Box>
                                <Box border={"2px solid transparent"} borderRadius={"5"} background={"#33763c"} padding={"1.5"}><ChatIcon boxSize={"7"}/></Box>
                                <Box border={"2px solid transparent"} borderRadius={"5"} background={"#33763c"} padding={"1.5"}><FaVideo size={"28"}/></Box>
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

export default Navbar