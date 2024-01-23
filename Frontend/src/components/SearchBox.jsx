import React from 'react'
import { Container, Box, Button, Stack, HStack, Input, InputGroup, InputRightAddon } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'

const SearchBox = () => {

    const runSearch = () => {
        console.log("searched")
    }

    return (
        <>
            <Box width={"24%"}>
                <InputGroup size='md' border={"transparent"}>
                    <Input placeholder='Search' background={"#1f2029"} color={"white"} borderRadius={"3px 3px 3px 3px"}/>
                    <InputRightAddon background={"transparent"} onClick={runSearch} _hover={{cursor: "pointer"}} backgroundColor={"#323232cf"}>
                        <SearchIcon />
                    </InputRightAddon>
                </InputGroup>
            </Box>
        </>
    )
}

export default SearchBox