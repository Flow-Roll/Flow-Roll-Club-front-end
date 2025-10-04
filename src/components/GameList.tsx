// / LargeList.js
import { Paper, Skeleton, Stack } from '@mui/material';

import { fetchFromLocalStorage, saveToLocalStorage } from '../cache/localStorage';
import DisplayOddsAndPrizePool from './DisplayOddsAndPrizePool';
import { useState, useEffect } from 'react';
import { FLOWROLLGameContract, FLOWROLLNFTContract, getContractOnlyView, getJsonRpcProvider } from '../web3/ethers';
import { CONTRACTADDRESSES } from '../web3/contracts';
import { formatEther } from 'ethers';
import { useNavigate } from 'react-router';

const provider = getJsonRpcProvider();
const nftContract = await getContractOnlyView(provider, CONTRACTADDRESSES.FlowRollNFT, "FlowRollNFT.json")
// const PAGESIZE = 10;

//TODO: THIS NEEDS THE INDEXER SERVER!

//TODO: Make this page with PAGINATION

const GameList = (_props: { count: number }) => {
    const navigate = useNavigate();

    const [games, setGames] = useState<any>([]);
    const Row = ({ index, style }: { index: number, style: any }) => {

        useEffect(() => {
            const fetchNSet = async () => {

                if (!games[index]) {
                    const found = fetchFromLocalStorage(index)
                    if (!found) {
                        //Fetch it from the API
                        const flowRollContractAddress = await FLOWROLLNFTContract.view.flowRollContractAddresses(nftContract, index);
                        const name = await FLOWROLLNFTContract.view.nameOf(nftContract, index);
                        const flowRollGameContract = await getContractOnlyView(provider, flowRollContractAddress, "FlowRoll.json")

                        const gameParameters = await FLOWROLLGameContract.view.getContractParameters(flowRollGameContract);
                        const [winnerPrizeShare, diceRollCost, houseEdge, revealCompensation, min, max, betType] = gameParameters;


                        const g = games;
                        g[index] = {
                            name,
                            winnerPrizeShare: Number(winnerPrizeShare),
                            diceRollCost: formatEther(diceRollCost),
                            houseEdge: Number(houseEdge),
                            revealCompensation: formatEther(revealCompensation),
                            min: Number(min),
                            max: Number(max),
                            betType: betType === 0n ? "userguess" : "divisible",
                            divider: Number(betType)

                        };
                        setGames(g);
                        saveToLocalStorage(index, g[index])

                    } else {
                        const g = games;
                        g[index] = found;
                        setGames(g);
                    }
                }
            }

            fetchNSet()
        }, [])

        if (!games[index]) {
            return <Paper elevation={3} className="" style={style}>
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
            </Paper >
        }
        return (
            <div style={{ width: "100%", height: "500px", backgroundColor: "red", display: "flex", flexDirection: "row", justifyContent: "center" }}>

                <div onClick={() => { navigate(`/games/${index}`) }}
                    // className="cursor-pointer bg-gradient-to-br text-black rounded-xl shadow-lg p-5 min-w-[250px] transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out" 
                    style={style} >
                    <Stack justifyContent={"flex-start"} flexDirection={"column"} className={"ml-4"}>
                        <div className="w-20">
                            <h3 className="text-xl font-semibold mb-2 p-2">🎲{games[index].name}</h3>
                        </div>
                        <DisplayOddsAndPrizePool betMin={games[index].min} betMax={games[index].max} betType={games[index].betType} divider={games[index].divider}></DisplayOddsAndPrizePool>
                        {/* <div
                            className="rounded-xl w-40 bg-no-repeat bg-center bg-contain shadow border-l-4 border-green-400"
                        >

                            <div className=" space-y-1">

                                <p className="flex items-center gap-2">
                                    🎰 <span>Bet: <strong>{games[index].diceRollCost}</strong></span>
                                </p>
                                <p className="flex items-center gap-2">
                                    🎯 <span>Roll: <strong>{games[index].revealCompensation}</strong></span>
                                </p>
                                <p className="flex items-center gap-2 text-sm text-gray-600">
                                    💸 <span>Payout: {games[index].winnerPrizeShare}%</span>
                                </p>

                            </div>
                        </div> */}

                    </Stack >
                </div >
            </div>
        )
    };


    return (

        <Row index={0} style=""></Row>
    )
};

export default GameList;

