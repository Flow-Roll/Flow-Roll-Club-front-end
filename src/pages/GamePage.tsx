import { useParams } from 'react-router-dom';
import BettingPool from '../components/BettingPool';
import { Box, Typography, CircularProgress } from "@mui/material"
import DiceRollHistory from '../components/DiceRollHistory';
import { useEffect, useState } from 'react';
import { ERC20Contract, FLOWROLLGameContract, FLOWROLLNFTContract, getContractOnlyView, getJsonRpcProvider } from '../web3/ethers';
import { CONTRACTADDRESSES } from '../web3/contracts';
import { ZeroAddress, formatEther } from 'ethers';
import { calculateDivisibleOddsRatio, calculateOddsRatio } from '../components/DisplayOddsAndPrizePool';


export default function GamePage(props: { openSnackbar: (message: string) => void }) {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingErrorOccured, setLoadingErrorOccured] = useState("")
    const [prizePool, setPrizePool] = useState(0n)
    const [currency, setCurrency] = useState({ name: "", address: "" })
    const [bets, setBets] = useState({ lastBet: 0, lastClosedBet: 0 })
    const [gameContractAddress, setGameContractAddress] = useState("")
    const [gameParameters, setGameParameters] = useState({
        winnerPrizeShare: 0,
        diceRollCost: 0n,
        houseEdge: 0,
        revealCompensation: 0n,
        min: 0,
        max: 0,
        betType: 0
    });



    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const index = parseInt(id as string);
                const provider = getJsonRpcProvider();
                const contract = await getContractOnlyView(provider, CONTRACTADDRESSES.FlowRollNFT, "/FlowRollNFT.json")
                const _name = await FLOWROLLNFTContract.view.nameOf(contract, index)
                setName(_name);
                const _gameContractAddress = await FLOWROLLNFTContract.view.flowRollContractAddresses(contract, index)
                setGameContractAddress(_gameContractAddress)
                const gameContract = await getContractOnlyView(provider, _gameContractAddress, "/FlowRoll.json");
                const tokenAddress = await FLOWROLLGameContract.view.ERC20Address(gameContract);

                if (tokenAddress === ZeroAddress) {
                    setCurrency({ name: "FLOW", address: tokenAddress })
                } else {
                    const erc20Contract = await getContractOnlyView(provider, tokenAddress, "/ERC20.json");
                    const tokenName = await ERC20Contract.view.name(erc20Contract);
                    setCurrency({ name: tokenName, address: tokenAddress })
                }


                const prizePool = await FLOWROLLGameContract.view.prizeVault(gameContract);
                setPrizePool(prizePool)
                const lastBet = await FLOWROLLGameContract.view.lastBet(gameContract);
                const lastClosedBet = await FLOWROLLGameContract.view.lastClosedBet(gameContract);
                setBets({ lastBet, lastClosedBet })

                const contractParameters = await FLOWROLLGameContract.view.getContractParameters(gameContract);
                const [winnerPrizeShare, diceRollCost, houseEdge, revealCompensation, min, max, betType] = contractParameters;

                setGameParameters({
                    winnerPrizeShare,
                    diceRollCost,
                    houseEdge,
                    revealCompensation,
                    min,
                    max,
                    betType
                })

                setLoading(false);
            } catch (err) {
                console.error(err)
                setLoadingErrorOccured("Unable to load this game.")
                setLoading(false)
            }
        }

        if (!id || isNaN(parseInt(id))) {
            console.log("here")
            setLoadingErrorOccured("Unable to load this game");
            setLoading(false)
            return;
        }


        fetchInitialData()
    }, [])

    // a polling function to check the bets, lastBet and lastClosedBet, to display incoming stuff, every 5 seconds poll maybe

    useEffect(() => {
        // Define the polling function
        console.log("polling use effect runs")
        const fetchData = async () => {
            console.log("polling")
            try {

                const index = parseInt(id as string);
                const provider = getJsonRpcProvider();
                const contract = await getContractOnlyView(provider, CONTRACTADDRESSES.FlowRollNFT, "/FlowRollNFT.json")
                const _gameContractAddress = await FLOWROLLNFTContract.view.flowRollContractAddresses(contract, index)
                const gameContract = await getContractOnlyView(provider, _gameContractAddress, "/FlowRoll.json");

                const prizePool = await FLOWROLLGameContract.view.prizeVault(gameContract);
                setPrizePool(prizePool)

                //TODO: Set bets and etc

            } catch (error) {
                console.error('Fetch error:', error);
                //TODO: snackbar should trigger with unable to refresh
                props.openSnackbar("Unable to refresh game page")
            }
        };

        // Fetch immediately on mount
        // fetchData();

        // Set up interval to poll every 5 seconds
        const intervalId = setInterval(fetchData, 5000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []);



    if (loading) {
        return <div className=' mx-auto p-6 '>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <CircularProgress />
            </Box>
        </div>;
    }

    if (loadingErrorOccured !== "") {
        return <div className=' mx-auto p-6 '>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant='h1' component="h1" >Unable to load game</Typography>

            </Box>
        </div>
    }

    return <div className=' '>
        <Box><BettingPool
            name={name}
            gameId={id}
            currency={currency.name}
            currencyAddress={currency.address}
            prizePool={formatEther(prizePool)}
            betAmount={formatEther(gameParameters.diceRollCost)}
            rollReward={formatEther(gameParameters.revealCompensation)}
            odds={gameParameters.betType > 1 ? calculateDivisibleOddsRatio(Number(gameParameters.min), Number(gameParameters.max), Number(gameParameters.betType)) : calculateOddsRatio(Number(gameParameters.min), Number(gameParameters.max))}
            winnerPrizeShare={gameParameters.winnerPrizeShare}
            calculatedReward={calculateReward(parseFloat(formatEther(prizePool)), Number(gameParameters.winnerPrizeShare))}
            min={Number(gameParameters.min)}
            max={Number(gameParameters.max)}
            betType={Number(gameParameters.betType) > 1 ? "divisible" : "userguess"}
            divider={Number(gameParameters.betType)}
            openSnackbar={props.openSnackbar}
            gameContractAddress={gameContractAddress}
        /></Box>
        {/* TODO: pagination for dice roll history */}
        <Box><DiceRollHistory /></Box>

    </div>;
}

function calculateReward(prizePool: number, percentage: number) {
    return Number(((prizePool / 100) * percentage).toFixed(4));
}