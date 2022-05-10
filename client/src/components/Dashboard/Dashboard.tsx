import { Stack, HStack, VStack, Grid, GridItem } from '@chakra-ui/react'
import React, { useEffect } from "react";
import { Contract, NFT } from '../../utils/Types';
import { getContractsInQueue, getNFTsInQueue } from '../../actions/Firebase';
import NavigationBar from '../UI/NavigationBar/NavigationBar';

function Dashboard(){
    const [contractsQueue, setContractsQueue] = React.useState<Contract[]>([]);
    const [nftQueue, setNftQueue] = React.useState<NFT[]>([]);

    useEffect(() => {
        async function getDashbordInfo(){
            const contracts: Contract[] = await getContractsInQueue();
            const nfts: NFT[] = await getNFTsInQueue();

            setContractsQueue(contracts);
            setNftQueue(nfts);
        }

        getDashbordInfo().then().catch();
    })

    return (
        <Grid   
        h='200px'
        templateRows='repeat(10, 1fr)'
        templateColumns='repeat(15, 1fr)'
        gap={4}>
            <GridItem colStart={[1, 1, 1, 1]} colSpan={[15, 15, 1, 1]} rowStart={[3, 3, 0, 0]} rowSpan={[2,2,4,4]} ml={[0,0,0,0]}>
                <NavigationBar></NavigationBar>
            </GridItem>

        </Grid>
        )
}

export default Dashboard;