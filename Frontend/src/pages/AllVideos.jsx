import React, { useState, useEffect } from 'react'
import { useAuth } from "@clerk/clerk-react"
import { Container, Box, Button, HStack } from '@chakra-ui/react'
import { Navbar, Sidebar, AllVideosGrid } from '../components'

const AllVideos = (props) => {

    const profile = props.profile
    const setProfile = props.setProfile
    const setViewVideoDetails = props.setViewVideoDetails

    const { getToken } = useAuth()
    const [token, setToken] = useState(localStorage.getItem("clerk_streamify_token"))
  
    getToken({ template: 'streamify_user' }).then((temp) => {
  
      if (!token){
        localStorage.setItem('clerk_streamify_token', temp)
        setToken(temp)
      }
    })

    useEffect(() => {
        if (token) {
          axios.defaults.headers.common["Authorization"] = "Bearer " + `${token}`;
        } else {
          delete axios.defaults.headers.common["Authorization"];
          localStorage.removeItem('clerk_streamify_token')
        }
    }, [token]);

    return (
        <>
            <Box height={"100vh"} w={"100vw"} background={"#181920"} margin={"0"} padding={"0"}>
                <Navbar profile = {profile}/>
                <Box width={"100vw"} background={"#181920"} color={"white"} height={"91%"} >
                    <HStack height={"100%"} spacing={"0"}>

                        <Sidebar profile = {profile} setProfile={setProfile} setViewVideoDetails = {setViewVideoDetails}/>
                        <AllVideosGrid profile = {profile} setViewVideoDetails = {setViewVideoDetails}/>

                    </HStack>
                </Box>
            </Box>
        </>
    )
}

export default AllVideos