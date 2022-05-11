import React from "react";
import { Stack, HStack, VStack, Box, Text} from '@chakra-ui/react'
import { Analytics } from "../../../utils/Types";

function ChainAnalytics (props: Analytics){
    return (
        <Box w='100%' display="flex" justifyContent={['center', 'center', 'start', 'start']} >
            <Stack direction={['column', 'row']} display="flex">
                <VStack display='flex'>
                    <Text fontSize='4xl' fontWeight="bold" display="flex" w='100%'>Chain Analytics</Text>
                    <Stack direction={['column','column', 'row', 'row']} spacing={3} display="flex" justifyContent="center">

                        <Box boxShadow='md' bg="white"
                        w={["90vw","90vw","30vw","30vw"]} > 

                            <Text fontSize={['2xl']} fontWeight="bold" ml={["15px","15px","15px","15px"]} mt={["15px","15px","15px","15px"]}>Number of ERC 721 Tokens</Text>

                            <Text fontSize='4xl' ml={["15px","15px","15px","15px"]} fontWeight="bold" mt="2vh">{props.totalERC721}</Text>
                        </Box>
                        
                        <Box boxShadow='md' bg="white"
                        w={["90vw","90vw","30vw","30vw"]}> 

                            <Text fontSize={['2xl']} fontWeight="bold" ml={["15px","15px","15px","15px"]} mt={["15px","15px","15px","15px"]}>Number of ERC 1155 Tokens</Text>
                            <Text fontSize='4xl' ml={["15px","15px","15px","15px"]} mt="2vh" fontWeight="bold">{props.totalERC1155}</Text>
                        </Box>

                        <Box boxShadow='md' bg="white"
                        w={["90vw","90vw","30vw","30vw"]}> 

                            <Text fontSize={['2xl']} fontWeight="bold" ml={["15px","15px","15px","15px"]} mt={["15px","15px","15px","15px"]}>Number of Ethereum NFTs</Text>
                            <Text fontSize='4xl' ml={["15px","15px","15px","15px"]} mt="2vh" fontWeight="bold">{props.totalEthereumNFTs}</Text>
                        </Box>


                    </Stack>
                </VStack>
            </Stack>
        </Box>
    );
};

export default ChainAnalytics;