import React from 'react'
import { Container, Box, Button, Stack, HStack, VStack, Input, InputGroup, InputRightAddon, Image, Text, Avatar, FormLabel } from '@chakra-ui/react'
import { SearchIcon, ChatIcon } from '@chakra-ui/icons'
import { DashboardImage, Exitmage } from "../assets"
import { UserButton } from '@clerk/clerk-react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import { FaVideo } from "react-icons/fa6"
import { FaUpload } from "react-icons/fa6";

const Navbar = () => {
    return (
        <>
            <Box width={"100vw"} background={"#252630"} color={"white"} height={"9%"}>

                <HStack height={"16"} alignContent={"center"} justifyItems={"center"} justifyContent={"space-between"}>

                    <LeftCornerNavbar />

                    <SearchBox />

                    <RightCornerNavbar />

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

const RightCornerNavbar = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    const showDashboard = () => {
        console.log("show dashboard")
    }

    return (
        <>

            <StartNewStream isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

            <Box width={"20%"} marginRight={"2"}>
                <HStack spacing={"0"} justifyContent={"space-between"}>
                    <HStack spacing={"3"} _hover={{ cursor: "pointer" }} onClick={showDashboard}>
                        <Button onClick={onOpen}>Start Streaming</Button>
                        <Image
                            boxSize='22px'
                            src={DashboardImage}
                            alt='Dashboard-Image'
                        />

                        <Text fontSize='md'>Dashboard</Text>
                        {/* OR */}
                        {/* <Image
                            boxSize='22px'
                            src={Exitmage}
                            alt='Exit-Image'
                        />
                        <Text fontSize='md'>Exit</Text> */}
                    </HStack>
                    <UserButton afterSignOutUrl='/signin' />
                    {/* <Avatar boxSize={"9"} name='Kola Tioluwani' src='https://bit.ly/tioluwani-kolawole' /> */}
                </HStack>
            </Box>
        </>
    )
}

const StartNewStream = (props) => {

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
                                // onChange={event => setEmail(event.currentTarget.value)}
                                // variant='filled'
                            />
                            <FormLabel marginTop={"2"} opacity={"0.7"}>Video Description</FormLabel>
                            <Input
                                size="lg"
                                border="1px solid #4c4c4c"
                                // variant='filled'
                            // onChange={event => setEmail(event.currentTarget.value)}
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
                    <Button colorScheme='blue' mr={3} onClick={props.onClose}>
                        Start Stream ▶
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default Navbar