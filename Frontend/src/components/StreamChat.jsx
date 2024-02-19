import React, { useRef, useState, useEffect } from 'react'
import { Container, Box, Button, Stack, HStack, VStack, Input, InputGroup, InputRightAddon, Image, Text, Avatar, Icon, InputRightElement } from '@chakra-ui/react'
import { ArrowDownIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { DashboardImage, Exitmage, Followers } from "../assets"
import { sendMessagePublisher, socketPublisher } from '../mediaSoupEndPoints'
import { sendMessageConsumer, socketConsumer } from '../mediaSoupEndPoints'
import { useUser } from "@clerk/clerk-react"

const StreamChat = (props) => {

  let socket;
  let sendMessage;

  if (props.profile == "viewer") {
    socket = socketConsumer
    sendMessage = sendMessageConsumer
  }
  else {
    socket = socketPublisher
    sendMessage = sendMessagePublisher
  }

  const bottom = useRef()
  const [messages, setMessages] = useState([])

  socket.on("recv-message", (messageDetails) => {
    setMessages([...messages, [messageDetails[0], messageDetails[1], messageDetails[2]]])   //userName, time, newMessage
  })

  useEffect(() => {

    const scrollToBottom = () => {
      bottom.current?.scrollIntoView({ behaviour: 'smooth' })
    }

    scrollToBottom()
  }, [messages]);

  return (
    <>
      <Box width={"20%"} background={"#1f2029"} color={"white"} height={"100%"}>

        <VStack height={"100%"} justifyContent={"space-between"}>

          <ChatTop />

          <ChatBox bottom={bottom} messages={messages}/>

          <NewMessage sendMessage={sendMessage} bottom={bottom}/>

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

const ChatBox = (props) => {

  return (
    <>
      <Box height={"100%"} width={"100%"} overflowY={"auto"}>
        <VStack alignItems={"flex-start"} minH={"100%"} justifyContent={"flex-end"}>

          {
            props.messages.map((message, key) => {

              return (
                <Text fontSize={"sm"} paddingX={"5"} wordBreak={"break-word"}>
                  {message[0]} &nbsp; <span style={{ color: "#92fa92" }}><b>{message[1]}:</b></span> &nbsp; {message[2]}
                </Text>
              )
            })
          }

          <div ref={props.bottom}></div>
        </VStack>
      </Box>
    </>
  )
}

const NewMessage = (props) => {

  const [newMessage, setNewMessage] = useState('')
  const { user } = useUser()
  const userName = user.fullName

  const handleSubmit = (event) => {
    event.preventDefault()
    props.sendMessage(userName, new Date().toLocaleTimeString(), newMessage)
    setNewMessage("")
  }

  return (
    <>
      <Box width={"86%"} paddingY={"5"}>
        <form onSubmit={handleSubmit}>
          <InputGroup border={"#4f4f4f"}>
            <Input placeholder='Send a message' value={newMessage} onChange={event => setNewMessage(event.currentTarget.value)} />
            <InputRightElement background={"#89898924"} _hover={{ cursor: "pointer" }} onClick={handleSubmit}>
              <ArrowForwardIcon color='white' />
            </InputRightElement>
          </InputGroup>
        </form>
      </Box>
    </>
  )
}

export default StreamChat