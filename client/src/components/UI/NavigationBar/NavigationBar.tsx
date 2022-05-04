import React from "react";
import { Stack, HStack, VStack } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'

function NavigationBar (){
    return(
        <VStack>
            <Button colorScheme='blue' variant='outline'>
                Search
            </Button> 
            <Button colorScheme='blue' variant='outline'>
                Add NFTs
            </Button>        
            <Button colorScheme='blue' variant='outline'>
                Dashboard
            </Button>               
        </VStack>
    );
}

export default NavigationBar;