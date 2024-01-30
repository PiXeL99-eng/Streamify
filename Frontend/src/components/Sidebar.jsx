import React from 'react'
import { Container, Box, Button, Stack, HStack, VStack, Input, InputGroup, InputRightAddon, Image, Text, Avatar, Icon } from '@chakra-ui/react'
import { ArrowDownIcon } from '@chakra-ui/icons'
import { DashboardImage, Exitmage } from "../assets"

const Sidebar = () => {
    return (
        <>
            <Box width={"20%"} background={"#1f2029"} color={"white"} height={"100%"}>

                <VStack>

                    <ForYou />

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

                <VStack  width={"100%"} justifyContent={"space-between"} spacing={"4"}>
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
                    <HStack width={"100%"} justifyContent={"space-between"}  borderRadius={"7px"} padding={"8px"}>
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

export default Sidebar