import React from 'react'
import { Container, Box, Button, Stack, HStack } from '@chakra-ui/react'

import SearchBox from './SearchBox'

const Navbar = () => {
    return (
        <>
            <Box width={"100vw"} background={"#252630"} color={"white"}>

                <HStack height={"16"} alignContent={"center"} justifyItems={"center"} justifyContent={"space-between"}>

                    <Box >
                        content1
                    </Box>

                    <SearchBox />

                    <Box >
                        content1

                    </Box>

                </HStack>

            </Box>
        </>
    )
}

export default Navbar