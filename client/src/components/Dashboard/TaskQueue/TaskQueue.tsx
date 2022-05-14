import React from "react";
import { VStack } from '@chakra-ui/react'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Text
  } from '@chakra-ui/react'
import { Contract, NFT, TaskQueueProps, TaskQueueType } from "../../../utils/Types";

function TaskQueue(props: TaskQueueProps){
    return (
            <VStack w={['90%','90%','100%','100%']} mr={["0","0","1.5%","1.5%"]} mb={["30px", "30px", "0px", "0px"]}>
                <Text fontSize='4xl' fontWeight="bold" display="flex" w='100%' >Task Queue Information</Text>
                <TableContainer w='100%'>
                    <Table variant='striped' colorScheme="blackAlpha">
                        <Thead>
                            <Tr>
                                <Th fontSize={['md','lg','xl']} fontWeight="bold">Order</Th>
                                <Th fontSize={['md','lg','xl']} fontWeight="bold">NFT Media / Contract in Queue</Th>
                                <Th fontSize={['md','lg','xl']} fontWeight="bold" display={['none','none', 'block','block']}>Task Type</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                        {props.data.map((value, index) => {
                            return <Tr>
                                <Td fontSize={['lg']} fontWeight="bold">{index}</Td>
                                {value.type === TaskQueueType.ITEM_NFT && 
                                <Td fontSize={['xs','sm','lg']}>
                                    {(value.data as NFT).media}
                                </Td>}
                                {value.type === TaskQueueType.ITEM_CONTRACT || value.type == TaskQueueType.ITEM_NOT_APPLICABLE && 
                                <Td fontSize={['xs','sm','lg']}>
                                    {(value.data as Contract).address}
                                </Td>}
                                <Td fontSize={['xs','sm','lg']} display={['none','none', 'block','block']}>{value.type}</Td>

                            </Tr>
                        })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </VStack>
        );
}

export default TaskQueue;
