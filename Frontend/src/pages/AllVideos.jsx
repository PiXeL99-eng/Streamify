import React, {useState} from 'react'
import { Container, Box, Button, HStack } from '@chakra-ui/react'
import { Navbar, Sidebar, AllVideosGrid } from '../components'

const AllVideos = () => {

    const [profile, setProfile] = useState("viewer") // or viewer   ----------- set this one to global profile

    return (
        <>
            <Box height={"100vh"} w={"100vw"} background={"#181920"} margin={"0"} padding={"0"}>
                <Navbar setProfile={setProfile} profile={profile}/>
                < Box width={"100vw"} background={"#181920"} color={"white"} height={"91%"} >
                    <HStack height={"100%"} spacing={"0"}>

                        <Sidebar profile = {profile}/>
                        <AllVideosGrid/>

                    </HStack>
                </Box>
            </Box>
        </>
    )
}

export default AllVideos