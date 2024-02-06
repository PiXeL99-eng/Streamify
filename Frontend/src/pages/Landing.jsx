import React from 'react'
import { Container, Box, Button, Stack, HStack, Heading, VStack, Link, Input, InputGroup, InputRightAddon, Image, Text, Avatar, Icon, InputRightElement } from '@chakra-ui/react'
import { ArrowDownIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { githubLogo } from "../assets"
import { useNavigate } from 'react-router-dom'
import { SignInButton } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react"

const Landing = () => {

    const { userId, isLoaded } = useAuth()
    console.log(userId)

    return (
        <>
            <Box width={"100%"} minHeight={"100vh"} background={"#171923"} color={"white"}>

                <Box width={"85%"} height={"5rem"} paddingY={"4"} paddingX={"10"} marginX={"auto"}>
                    <HStack alignContent={"center"} justifyItems={"center"} justifyContent={"space-between"}>

                        <LeftCornerNavbar />

                        <RightCornerNavbar />

                    </HStack>
                </Box>

                <Box width={"85%"} paddingX={"10"} marginX={"auto"}>
                    <VStack>
                        <Text fontSize={"75px"} bgClip='text' bgGradient="linear(to-l, rgba(63,94,251,1), rgba(252,70,107,1))" fontFamily={"Outfit, sans-serif"} as={"b"} textAlign={"center"}>
                            Stream and watch any content
                        </Text>

                        <Text marginTop={"4"} color={"white"} fontSize={"22px"} width={"80%"} textAlign={"center"} fontFamily={"Open Sans, sans-serif"}>
                            Streamify allows you to stream and watch content live. With features like live chat, video camera and screen capture, connect with your viewers effectively.
                        </Text>

                        {userId ?

                            <Link href='/allvideos'>
                                <Button bgGradient='linear(to-l, #7928cae3, #ff0080a6)' color={"black"} _hover={{ bgGradient: 'linear(to-l, #7928ca96, #ff00809c)' }} _active={{ bgGradient: 'linear(to-l, #7928cae3, #ff0080a6)' }} padding={"25px"} fontSize={"22px"} marginTop={"18px"}>
                                    Sign in to Streamify 📺
                                </Button>

                            </Link>
                            :
                            <SignInButton redirectUrl="/allvideos" mode="redirect">

                                <Button bgGradient='linear(to-l, #7928cae3, #ff0080a6)' color={"black"} _hover={{ bgGradient: 'linear(to-l, #7928ca96, #ff00809c)' }} _active={{ bgGradient: 'linear(to-l, #7928cae3, #ff0080a6)' }} padding={"25px"} fontSize={"22px"} marginTop={"18px"}>
                                    Sign in to Streamify 📺
                                </Button>

                            </SignInButton>

                        }

                    </VStack>
                </Box>

                <Box>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path fill="#273036" fill-opacity="1" d="M0,192L6.7,197.3C13.3,203,27,213,40,229.3C53.3,245,67,267,80,261.3C93.3,256,107,224,120,208C133.3,192,147,192,160,197.3C173.3,203,187,213,200,202.7C213.3,192,227,160,240,160C253.3,160,267,192,280,202.7C293.3,213,307,203,320,181.3C333.3,160,347,128,360,138.7C373.3,149,387,203,400,218.7C413.3,235,427,213,440,202.7C453.3,192,467,192,480,170.7C493.3,149,507,107,520,112C533.3,117,547,171,560,181.3C573.3,192,587,160,600,144C613.3,128,627,128,640,117.3C653.3,107,667,85,680,90.7C693.3,96,707,128,720,144C733.3,160,747,160,760,144C773.3,128,787,96,800,96C813.3,96,827,128,840,165.3C853.3,203,867,245,880,234.7C893.3,224,907,160,920,128C933.3,96,947,96,960,106.7C973.3,117,987,139,1000,170.7C1013.3,203,1027,245,1040,224C1053.3,203,1067,117,1080,85.3C1093.3,53,1107,75,1120,80C1133.3,85,1147,75,1160,101.3C1173.3,128,1187,192,1200,213.3C1213.3,235,1227,213,1240,208C1253.3,203,1267,213,1280,208C1293.3,203,1307,181,1320,170.7C1333.3,160,1347,160,1360,176C1373.3,192,1387,224,1400,218.7C1413.3,213,1427,171,1433,149.3L1440,128L1440,320L1433.3,320C1426.7,320,1413,320,1400,320C1386.7,320,1373,320,1360,320C1346.7,320,1333,320,1320,320C1306.7,320,1293,320,1280,320C1266.7,320,1253,320,1240,320C1226.7,320,1213,320,1200,320C1186.7,320,1173,320,1160,320C1146.7,320,1133,320,1120,320C1106.7,320,1093,320,1080,320C1066.7,320,1053,320,1040,320C1026.7,320,1013,320,1000,320C986.7,320,973,320,960,320C946.7,320,933,320,920,320C906.7,320,893,320,880,320C866.7,320,853,320,840,320C826.7,320,813,320,800,320C786.7,320,773,320,760,320C746.7,320,733,320,720,320C706.7,320,693,320,680,320C666.7,320,653,320,640,320C626.7,320,613,320,600,320C586.7,320,573,320,560,320C546.7,320,533,320,520,320C506.7,320,493,320,480,320C466.7,320,453,320,440,320C426.7,320,413,320,400,320C386.7,320,373,320,360,320C346.7,320,333,320,320,320C306.7,320,293,320,280,320C266.7,320,253,320,240,320C226.7,320,213,320,200,320C186.7,320,173,320,160,320C146.7,320,133,320,120,320C106.7,320,93,320,80,320C66.7,320,53,320,40,320C26.7,320,13,320,7,320L0,320Z"></path>
                    </svg>

                </Box>
            </Box>
        </>
    )
}

const LeftCornerNavbar = () => {

    const navigate = useNavigate()

    return (
        <>
            <Box>
                <HStack spacing={"3"} _hover={{ cursor: "pointer" }} onClick={() => navigate("/", { replace: true })}>
                    <Image
                        borderRadius='full'
                        boxSize='45px'
                        src='https://bit.ly/dan-abramov'
                        alt='Dan Abramov'
                    />
                    <Heading fontSize={"lg"} fontFamily={"Outfit, sans-serif"}>Streamify</Heading>
                </HStack>
            </Box>
        </>
    )
}

const RightCornerNavbar = () => {

    const { userId, isLoaded } = useAuth()

    return (
        <>

            <Box>
                <HStack spacing={"5"} justifyContent={"space-between"}>
                    <Link href='https://github.com/PiXeL99-eng/Streamify' isExternal>
                        <Image
                            borderRadius='full'
                            boxSize='40px'
                            src={githubLogo}
                            alt='Dan Abramov'
                            _hover={{ cursor: "pointer" }} onClick={() => navigate("https://github.com/PiXeL99-eng/Streamify", { replace: false })}
                        />
                    </Link>

                    {userId ?

                        <Link href='/allvideos'>
                            <Button colorScheme='cyan' variant='outline' _hover={{ background: "transparent" }} _active={{ background: "transparent" }}>
                                Sign in
                            </Button>
                        </Link>
                        :
                        <SignInButton redirectUrl="/allvideos">
                            <Button colorScheme='cyan' variant='outline' _hover={{ background: "transparent" }} _active={{ background: "transparent" }}>
                                Sign in
                            </Button>
                        </SignInButton>

                    }



                </HStack>
            </Box>
        </>
    )
}

export default Landing