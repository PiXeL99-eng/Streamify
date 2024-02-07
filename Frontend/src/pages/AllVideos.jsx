import React, {useState} from 'react'
import { Container, Box, Button, HStack } from '@chakra-ui/react'
import { Navbar, Sidebar, AllVideosGrid } from '../components'

const AllVideos = (props) => {

    const profile = props.profile
    const setProfile = props.setProfile

    return (
        <>
            <Box height={"100vh"} w={"100vw"} background={"#181920"} margin={"0"} padding={"0"}>
                <Navbar setProfile={setProfile} profile={profile}/>
                <Box width={"100vw"} background={"#181920"} color={"white"} height={"91%"} >
                    <HStack height={"100%"} spacing={"0"}>

                        <Sidebar profile = {profile} setProfile={setProfile}/>
                        <AllVideosGrid profile = {profile}/>

                    </HStack>
                </Box>
            </Box>
        </>
    )
}

export default AllVideos