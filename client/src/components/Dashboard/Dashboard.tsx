import { Stack, HStack, VStack } from '@chakra-ui/react'
import React, { useEffect } from "react";
import { Contract, NFT } from '../../utils/Types';
import { getContractsInQueue, getNFTsInQueue } from '../../actions/firebase';
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
            <NavigationBar/>   
    )
}

export default Dashboard;