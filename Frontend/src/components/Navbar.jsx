import React, { useState, useRef } from 'react'
import { Container, Box, Button, Stack, HStack, VStack, Input, InputGroup, InputRightAddon, Image, Text, Avatar, FormLabel } from '@chakra-ui/react'
import { SearchIcon, ChatIcon } from '@chakra-ui/icons'
import { DashboardImage, Exitmage } from "../assets"
import { UserButton } from '@clerk/clerk-react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from '@chakra-ui/react'
import { FaVideo, FaUpload } from "react-icons/fa6"
import { useNavigate } from "react-router-dom"

const Navbar = () => {
    
    const [query, setQuery] = useState('')

    return (
        <>
            <Box width={"100vw"} background={"#252630"} color={"white"} height={"9%"}>

                <HStack height={"16"} alignContent={"center"} justifyItems={"center"} justifyContent={"space-between"}>

                    <LeftCornerNavbar />

                    <SearchBox setQuery = {setQuery} query = {query}/>

                    <RightCornerNavbar setQuery = {setQuery}/>

                </HStack>

            </Box>
        </>
    )
}

const SearchBox = (props) => {

    const navigate = useNavigate()

    const runSearch = (event) => {
        event.preventDefault()
        navigate(`/allvideos/${props.query}`, { replace: true })
    }

    return (
        <>
            <Box width={"24%"}>
                <form onSubmit={runSearch}>
                    <InputGroup size='md' border={"transparent"}>
                        <Input placeholder='Search' background={"#1f2029"} color={"white"} value={props.query} borderRadius={"3px 3px 3px 3px"} onChange={(e) => props.setQuery(e.target.value)} />
                        <InputRightAddon background={"transparent"} onClick={runSearch} _hover={{ cursor: "pointer" }} backgroundColor={"#323232cf"} typeof='submit'>
                            <SearchIcon />
                        </InputRightAddon>
                    </InputGroup>
                </form>
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

    const showAllVideos = () => {
        props.setQuery('')
        navigate("/allvideos", { replace: true })
    }

    return (
        <>
            <Box width={"12%"} marginRight={"2"}>
                <HStack spacing={"0"} justifyContent={"space-around"}>
                    <HStack spacing={"2"} _hover={{ cursor: "pointer" }} onClick={showAllVideos}>
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

export default Navbar