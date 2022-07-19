import React, { useEffect } from "react";
import { Button, HStack, VStack, Text, Stack } from '@chakra-ui/react'
import {processNextContracts} from '../../../actions/TaskQueueControl';
import { getLastContract } from "../../../actions/Backend";

function TaskQueueControl(){
    const [processing, setProcesssing] = React.useState(false);
    const [lastContract, setLastContract] = React.useState("No Last Contract");

    useEffect(() => {
        async function getLast() {
            setLastContract(await getLastContract());
        }

        getLast().then().catch();
    }, [])

    async function processContracts () {
        setProcesssing(true);
        await processNextContracts();
        setLastContract(await getLastContract());
        setProcesssing(false);    
    }
    
    return (
        <Stack direction={['column', 'column','row','row']} mb={["30px", "30px", "0px", "0px"]} mr={["20px", "20px", "0px"]} ml={["20px", "20px", "0px"]} spacing={["3", "3", "10"]}>
            { !processing &&            
            <Button bg='blackAlpha.800'
            _hover={{ bg: 'blackAlpha.800' }}
            color="white"
            variant='solid'
            onClick={processContracts}
            width={['','','250px']}
            >Process Next Contracts</Button>}

            {processing && <Button isLoading 
                                   loadingText='Retrieving Contracts'
                                   bg='blackAlpha.800'
                                   color="white"
                                   _hover={{ bg: 'blackAlpha.800' }}
                                   variant='solid'>
                            </Button>}
            <Text fontSize={['lg', 'lg', 'xl']} fontWeight='bold' align={["center", "center", "start"]}>Last Contract Processed: {lastContract}</Text>
        </Stack>
    )
}

export default TaskQueueControl;