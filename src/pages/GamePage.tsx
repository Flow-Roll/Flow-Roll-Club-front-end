import { useParams } from 'react-router-dom';
import BettingPool from '../components/BettingPool';
import { Box, Typography, CircularProgress } from "@mui/material"
import { useEffect, useState } from 'react';
import { ERC20Contract, FLOWROLLGameContract, FLOWROLLNFTContract, getContractOnlyView, getJsonRpcProvider } from '../web3/ethers';
import { CONTRACTADDRESSES } from '../web3/contracts';
import { ZeroAddress, formatEther } from 'ethers';
import { calculateDivisibleOddsRatio, calculateOddsRatio } from '../components/DisplayOddsAndPrizePool';
import BettingCardsGrid from '../components/BettingCards';


export default function GamePage(props: { openSnackbar: (message: string) => void }) {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingErrorOccured, setLoadingErrorOccured] = useState("")
    const [prizePool, setPrizePool] = useState(0n)
    const [currency, setCurrency] = useState({ name: "", address: "" })
    const [_bets, setBets] = useState({ lastBet: 0, lastClosedBet: 0 })
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
    const [lastBets, setLastBets] = useState<any>([])
    const [lastBetIndex, setLastBetIndex] = useState(0);
    const [lastClosedBetIndex, setLastClosedBetIndex] = useState(0);
    const [firstFetchDone, setFirstFetchDone] = useState(false);



    const fetchBets = async (contractAddress: string, firstFetchDone_: boolean) => {
        if (contractAddress === "") {
            return;
        }
        const provider = getJsonRpcProvider()
        const viewC = await getContractOnlyView(provider, contractAddress, "/FlowRoll.json")
        const lastCachedBet = lastBetIndex;
        const lastBet = await FLOWROLLGameContract.view.lastBet(viewC)
        setLastBetIndex(lastBet)

        const lastClosedBet = await FLOWROLLGameContract.view.lastClosedBet(viewC)

        setLastClosedBetIndex(lastClosedBet)

        if (lastBet === 0n) {
            //Do not fetch last bets
            return
        }

        if (lastCachedBet === lastBet) {
            //Nothing was updated, do not run fetch

            return;
        }

        if (firstFetchDone_) {
            if (lastBet === lastClosedBet) {
                //The last closed bet is the last bet, don't fetch
                return;
            }
        }


        const last9Bets = []

        let toSub = 9n;

        if (lastBet < 9n) {
            if (lastBet > 1n) {
                toSub = lastBet - 1n;
            } else {
                toSub = 0n;
            }
        }


        for (let i = lastBet - toSub; i <= lastBet; i++) {
            const lastb = await FLOWROLLGameContract.view.bets(viewC, i);
            last9Bets.push(
                {
                    requestId: lastb[0],
                    createdAtBlock: lastb[1],
                    player: lastb[2],
                    bet: lastb[3],
                    closed: lastb[4],
                    won: lastb[5],
                    numberRolled: lastb[6],
                    payout: lastb[7]
                })
        }
        setLastBets(last9Bets.reverse())

        if (!firstFetchDone_) {
            setFirstFetchDone(true)
        }
    }

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const index = parseInt(id as string);
                const provider = getJsonRpcProvider();
                const contract = await getContractOnlyView(provider, CONTRACTADDRESSES.FlowRollNFT, "/FlowRollNFT.json")
                const _name = await FLOWROLLNFTContract.view.nameOf(contract, index).catch((err) => {
                    console.log(err)
                })
                if (_name === "") {
                    setName("Undefined")
                } else {
                    setName(_name)
                }

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


                const prizePool_ = await FLOWROLLGameContract.view.prizeVault(gameContract);
                setPrizePool(prizePool_)
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

                await fetchBets(gameContractAddress, firstFetchDone)

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
        const fetchData = async () => {
            try {

                const index = parseInt(id as string);
                const provider = getJsonRpcProvider();
                const contract = await getContractOnlyView(provider, CONTRACTADDRESSES.FlowRollNFT, "/FlowRollNFT.json")
                const _gameContractAddress = await FLOWROLLNFTContract.view.flowRollContractAddresses(contract, index)
                const gameContract = await getContractOnlyView(provider, _gameContractAddress, "/FlowRoll.json");
                const prizePool = await FLOWROLLGameContract.view.prizeVault(gameContract);
                setPrizePool(prizePool)

                await fetchBets(_gameContractAddress, firstFetchDone)


            } catch (error) {
                console.error('Fetch error:', error);
                //TODO: snackbar should trigger with unable to refresh
                props.openSnackbar("Unable to refresh game page")
            }
        };

        // Set up interval to poll every 5 seconds
        const intervalId = setInterval(fetchData, 5000);

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, [firstFetchDone]);


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
            prizePool={parseFloat(formatEther(prizePool)).toPrecision(10)}
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
        <BettingCardsGrid min={Number(gameParameters.min)}
            max={Number(gameParameters.max)}
            betType={Number(gameParameters.betType) > 1 ? "divisible" : "userguess"}
            divider={Number(gameParameters.betType)}
            lastClosedBetIndex={lastClosedBetIndex} lastBetIndex={lastBetIndex} bets={lastBets}></BettingCardsGrid>
    </div>
}

function calculateReward(prizePool: number, percentage: number) {
    return Number(((prizePool / 100) * percentage).toFixed(4));
}