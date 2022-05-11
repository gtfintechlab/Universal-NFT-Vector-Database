import { Stack, HStack, VStack, Grid, GridItem, Box } from '@chakra-ui/react'
import React, { useEffect } from "react";
import { Analytics, Contract, NFT } from '../../utils/Types';
import { getContractsInQueue, getNFTsInQueue } from '../../actions/Firebase';
import NavigationBar from '../UI/NavigationBar/NavigationBar';
import OverallAnalytics from './OverallAnalytics/OverallAnalytics';
import ChainAnalytics from './ChainAnalytics/ChainAnalytics';
import TaskQueue from './TaskQueue/TaskQueue';

function Dashboard(){
    const [contractsQueue, setContractsQueue] = React.useState<Contract[]>([]);
    const [nftQueue, setNftQueue] = React.useState<NFT[]>([]);
    const [analytics, setAnalytics] = React.useState({
        totalContracts: 0,
        totalERC1155: 0,
        totalERC721: 0,
        totalEthereumNFTs: 0,
        totalNFTs: 0
    } as Analytics);

    useEffect(() => {
        document.body.style.backgroundColor = '#f7f7f7'
        async function getDashbordInfo(){
            const contracts: Contract[] = await getContractsInQueue();
            const nfts: NFT[] = await getNFTsInQueue();

            setContractsQueue(contracts);
            setNftQueue(nfts);
        }

        getDashbordInfo().then().catch();
    })

    return (
        <Grid  h="100vh"
        templateRows='repeat(20, 1fr)'
        templateColumns='repeat(15, 1fr)'
        gap={4}>
            <GridItem colStart={[1, 1, 1, 1]} colSpan={[15, 15, 1, 1]} rowStart={[1, 1, 0, 0]} rowSpan={[5,5,4,4]}>
                <NavigationBar></NavigationBar>
            </GridItem>

            <GridItem colStart={[1,1,2,2]} colEnd={[16,16,15,16]} rowStart={[8,8,2,2]}display="flex" justifyContent="center">
                <OverallAnalytics totalContracts={analytics.totalContracts} 
                                  totalERC1155={analytics.totalERC1155} 
                                  totalERC721={analytics.totalERC721}
                                  totalEthereumNFTs={analytics.totalEthereumNFTs}
                                  totalNFTs={analytics.totalNFTs}/>
            </GridItem>
            <GridItem colStart={[1,1,2,2]} colEnd={[16,16,16,16]} rowStart={[16,16,3,3]} mt={["0px","0px", "30px", "30px"]}display="flex" justifyContent="center">
                <ChainAnalytics totalContracts={analytics.totalContracts} 
                                  totalERC1155={analytics.totalERC1155} 
                                  totalERC721={analytics.totalERC721}
                                  totalEthereumNFTs={analytics.totalEthereumNFTs}
                                  totalNFTs={analytics.totalNFTs}/>
            </GridItem>

            <GridItem>
                <TaskQueue></TaskQueue>
            </GridItem>



        </Grid>
        )
}

export default Dashboard;