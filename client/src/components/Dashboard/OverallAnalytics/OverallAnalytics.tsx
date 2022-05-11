import { Stack, VStack, Box, Text} from '@chakra-ui/react'
import { AnalyticsProps } from "../../../utils/Types";

function OverallAnalytics (props: AnalyticsProps){
    return (
        <Box w='100%' border="0px" borderColor="red" display="flex" justifyContent={['center', 'center', 'start', 'start']}>
            <Stack direction={['column', 'row']} display="flex">
                <VStack display='flex'>
                    <Text fontSize='4xl' fontWeight="bold" display="flex" w='100%'>Overall Analytics</Text>
                    <Stack direction={['column','column', 'row', 'row']} spacing={6} display="flex" justifyContent="center">

                        <Box boxShadow='md' bg="white"
                        w={["90vw","90vw","45vw","45vw"]}> 

                            <Text fontSize={['2xl', '2xl', '2xl', '2xl']} fontWeight="bold" ml={["15px","15px","15px","15px"]} mt={["15px"]}>Total NFTs in Milvus</Text>

                            <Text fontSize='4xl' ml={["15px","15px","15px","15px"]} fontWeight="bold" mt='2vh'>{props.totalNFTs}</Text>
                        </Box>
                        
                        <Box boxShadow='md' bg="white"
                        w={["90vw","90vw","45vw","45vw"]}> 

                            <Text fontSize={['2xl', '2xl', '2xl', '2xl']} fontWeight="bold" ml={["15px","15px","15px","15px"]} mt={["15px"]}>Total Contracts Processed</Text>
                            <Text fontSize='4xl' ml={["15px","15px","15px","15px"]} fontWeight="bold" mt='2vh'>{props.totalContracts}</Text>
                        </Box>

                    </Stack>
                </VStack>
            </Stack>
        </Box>
    );
};

export default OverallAnalytics;