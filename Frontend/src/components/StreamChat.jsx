import React from 'react'
import { Container, Box, Button, Stack, HStack, VStack, Input, InputGroup, InputRightAddon, Image, Text, Avatar, Icon, InputRightElement } from '@chakra-ui/react'
import { ArrowDownIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { DashboardImage, Exitmage, Followers } from "../assets"

const StreamChat = () => {
  return (
    <>
      <Box width={"20%"} background={"#1f2029"} color={"white"} height={"100%"}>

        <VStack height={"100%"} justifyContent={"space-between"}>

          <ChatTop />

          <ChatBox />

          <NewMessage />

        </VStack>


      </Box>
    </>
  )
}

const ChatTop = () => {
  return (
    <>
      <HStack width={"100%"} justifyContent={"space-between"} paddingX={"5"} paddingBottom={"3"} paddingTop={"2"}>
        <ArrowDownIcon />
        <Text fontSize={"l"} as={"b"}>
          Stream Chat
        </Text>
        <Image
          borderRadius='full'
          boxSize='30px'
          src={Followers}
          alt='followers'
        />
      </HStack>
    </>
  )
}

const ChatBox = () => {
  return (
    <>
      <Box height={"100%"} width={"100%"} overflow={"auto"} position={"relative"}>
        <VStack alignItems={"flex-start"} position={"absolute"} bottom={"0px"}>
          <Text fontSize={"sm"} paddingX={"5"} wordBreak={"break-word"}>
            15:12 &nbsp; <span style={{color: "#92fa92"}}><b>antonio:</b></span> &nbsp; Hello brogdzb
          </Text>
          <Text fontSize={"sm"} paddingX={"5"} wordBreak={"break-word"}>
            15:12 &nbsp; <span style={{color: "#92fa92"}}><b>antonio:</b></span> &nbsp; Hello brogdzb
          </Text>
          <Text fontSize={"sm"} paddingX={"5"} wordBreak={"break-word"}>
            15:12 &nbsp; <span style={{color: "#92fa92"}}><b>antonio:</b></span> &nbsp; Hello brogdzb
          </Text>
        </VStack>
      </Box>
    </>
  )
}

const NewMessage = () => {
  return (
    <>
      <Box width={"86%"} paddingY={"5"}>
        <InputGroup border={"#4f4f4f"}>
          <Input placeholder='Send a message' />
          <InputRightElement background={"#89898924"} _hover={{cursor: "pointer"}}>
            <ArrowForwardIcon color='white'/>
          </InputRightElement>
        </InputGroup>
      </Box>
    </>
  )
}

export default StreamChat