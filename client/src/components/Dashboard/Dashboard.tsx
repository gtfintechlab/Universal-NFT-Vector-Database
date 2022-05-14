import { Grid, GridItem } from '@chakra-ui/react'
import React, { useEffect } from "react";
import { AnalyticsProps, TaskQueueItem } from '../../utils/Types';
import { getAnalytics, getLastContract, getTaskQueueItems, updateLastContract } from '../../actions/Firebase';
import {getNextContracts}  from '../../actions/TaskQueueControl';
import NavigationBar from '../UI/NavigationBar/NavigationBar';
import OverallAnalytics from './OverallAnalytics/OverallAnalytics';
import ChainAnalytics from './ChainAnalytics/ChainAnalytics';
import TaskQueue from './TaskQueue/TaskQueue';
import { mockTaskQueueItem } from './../../utils/MockData';

function Dashboard(){
    const [taskQueueItems, setTaskQueueItems] = React.useState<TaskQueueItem[]>([]);
    const [analytics, setAnalytics] = React.useState({
        totalContracts: 0,
        totalERC1155: 0,
        totalERC721: 0,
        totalEthereumNFTs: 0,
        totalNFTs: 0
    } as AnalyticsProps);

    useEffect(() => {
        document.body.style.backgroundColor = '#f7f7f7'
        async function getDashbordInfo(){
            const taskQueueItems: TaskQueueItem[] = await getTaskQueueItems();
            const analytics: AnalyticsProps = await getAnalytics();
            if (taskQueueItems.length === 0){
                taskQueueItems.push(mockTaskQueueItem);
            }
            setTaskQueueItems(taskQueueItems);
            setAnalytics(analytics);
        }

        getDashbordInfo().then().catch();
    }, []);

    return (
        <Grid  h="100vh"
        templateRows='repeat(20, 1fr)'
        templateColumns='repeat(15, 1fr)'
        gap={4}>
            <GridItem colStart={[1, 1, 1, 1]} colSpan={[15, 15, 1, 1]} rowStart={[1, 1, 0, 0]} rowSpan={[5,5,4,4]}>
                <NavigationBar></NavigationBar>
            </GridItem>

            <GridItem colStart={[1,1,2,2]} colEnd={[16,16,16,16]} rowStart={[8,8,2,2]}display="flex" justifyContent="center">
                <OverallAnalytics totalContracts={analytics.totalContracts} 
                                  totalERC1155={analytics.totalERC1155} 
                                  totalERC721={analytics.totalERC721}
                                  totalEthereumNFTs={analytics.totalEthereumNFTs}
                                  totalNFTs={analytics.totalNFTs}/>
            </GridItem>

            <GridItem colStart={[1,1,2,2]} colEnd={[16,16,16,16]} rowStart={[10,10,4,4]}display="flex" justifyContent="center">
                <ChainAnalytics totalContracts={analytics.totalContracts} 
                                  totalERC1155={analytics.totalERC1155} 
                                  totalERC721={analytics.totalERC721}
                                  totalEthereumNFTs={analytics.totalEthereumNFTs}
                                  totalNFTs={analytics.totalNFTs}/>
            </GridItem>

            <GridItem colStart={[1,1,2,2]} colEnd={[16,16,16,16]} rowStart={[12,12,6,6]} display="flex" justifyContent="center">
                <TaskQueue tableName='' data={taskQueueItems}></TaskQueue>
            </GridItem>



        </Grid>
        )
}

export default Dashboard;