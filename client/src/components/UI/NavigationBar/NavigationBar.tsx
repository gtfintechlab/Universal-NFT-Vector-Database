import { Stack, Box } from '@chakra-ui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function NavigationBar (){
    return(
        <Box w={["100vw", "100vw", "80px", "80px"]} h={["100%", "100%", "150vh", "150vh"]} boxShadow='xl' bg="white" id="scroll">
            <Stack direction={['row', 'row', 'column', 'column']} spacing={["0px", "0px", "60px","60px"]}>
                <Box></Box>
                <Box></Box>
                <Box w={[
                    "33%",
                    "33%",
                    "100%",
                    "100%"
                ]}
                display="flex" justifyContent="center">
                    <Box mt={["2vh", "2vh", "0vh", "0vh"]}>
                        <FontAwesomeIcon icon="search" size="2x"/>
                    </Box>
                </Box>
                <Box w={[
                    "33%",
                    "33%",
                    "100%",
                    "100%"
                ]}
                
                 display="flex" justifyContent="center">
                    <Box mt={["2vh", "2vh", "0vh", "0vh"]}>
                        <FontAwesomeIcon icon="pencil" size="2x"/>
                    </Box>
                </Box>
                <Box w={[
                    "33%",
                    "33%",
                    "100%",
                    "100%"
                ]}
                
                display="flex" justifyContent="center">
                    <Box mt={["2vh", "2vh", "0vh", "0vh"]}>
                        <FontAwesomeIcon icon="grip" size="2x"/>
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
}

export default NavigationBar;