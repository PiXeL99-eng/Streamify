import React from 'react'
import { Container, Box, Button, Stack, HStack, VStack, Input, InputGroup, InputRightAddon, Image, Text, Avatar } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { DashboardImage } from "../assets"


const Navbar = () => {
    return (
        <>
            <Box width={"100vw"} background={"#252630"} color={"white"}>

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

    const showDashboard = () => {
        console.log("show dashboard")
    }
    return (
        <>
            <Box width={"12%"} marginRight={"8"}>
                <HStack spacing={"0"} justifyContent={"space-between"}>
                    <HStack spacing={"3"} _hover={{ cursor: "pointer" }} onClick={showDashboard}>
                        <Image
                            boxSize='22px'
                            src={DashboardImage}
                            alt='Dan Abramov'
                        />
                        <Text fontSize='md'>Dashboard</Text>
                        {/* OR  */}
                        {/* <Text fontSize={"12px"}>Creator Dashboard</Text>       */}
                    </HStack>
                    <Avatar boxSize={"9"} name='Kola Tioluwani' src='https://bit.ly/tioluwani-kolawole' />
                </HStack>
            </Box>
        </>
    )
}

export default Navbar