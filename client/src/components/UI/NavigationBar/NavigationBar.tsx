import React from "react";
import { Stack, HStack, VStack, Box } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'

function NavigationBar (){
    return(
        <VStack spacing='20px'>
            <Box boxShadow='2xl'
                width='80%'
                rounded='lg'>
            <Button width="100%" color="white" colorScheme="twitter">
                Search
            </Button> 
            </Box>

            <Box boxShadow='xl'
                width='80%'
                rounded='lg'>
            <Button width="100%" color="white" colorScheme="twitter">
                Add NFTs
            </Button> 
            </Box>

            <Box boxShadow='xl'
                width='80%'
                rounded='lg'>
            <Button width="100%" color="white" colorScheme="twitter">
                Dashboard
            </Button> 
            </Box>
               
        </VStack>
    );
}

export default NavigationBar;