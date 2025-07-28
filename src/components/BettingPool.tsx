import { useState } from 'react';
import { Plus, DollarSign, TrendingUp, Award } from 'lucide-react';
import DisplayOddsAndPrizePool from './DisplayOddsAndPrizePool';
import AnimatedBettingButtons from './Betbuttons';
import { handleNetworkSelect, requestAccounts } from '../web3/web3';
import { ERC20Contract, FLOWROLLGameContract, getContract } from '../web3/ethers';
import { formatEther, parseEther, ZeroAddress } from 'ethers';
import CopyLinkButton from './CopyButton';
import ShareXButton from './ShareOnX';
import { TextField } from '@mui/material';
import { calculateWinningNumbersList } from './GameConfiguration';
import { BetLostPopup, BetPlacedPopup, BetWonPopup } from './BettingPopup';

const PrizePoolDeposit = (props: {
    name: string,
    gameId: any,
    currency: string,
    currencyAddress: string,
    prizePool: string,
    betAmount: string,
    rollReward: string,
    odds: string,
    winnerPrizeShare: number,
    calculatedReward: number,
    min: number,
    max: number,
    betType: string,
    divider: number
    openSnackbar: (message: string) => void
    gameContractAddress: string
}) => {
    const [depositAmount, setDepositAmount] = useState('');
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

    const [numberToBetOn, setNumberToBetOn] = useState("");

    const [openPopups, setOpenPopups] = useState({
        placed: false,
        won: false,
        lost: false,
    });

    const [winAmount, setWinAmount] = useState("");
    const [numberRolled, setNumberRolled] = useState(0);

    const handleOpenPopup = (type) => {
        setOpenPopups(prev => ({ ...prev, [type]: true }));
        // Auto-close after 3 seconds
        setTimeout(() => {
            setOpenPopups(prev => ({ ...prev, [type]: false }));
        }, 3000);
    };

    const handleClosePopup = (type) => {
        setOpenPopups(prev => ({ ...prev, [type]: false }));
    };

    async function pollForRollAfterBet(gameContract: any) {
        const lastBet = await FLOWROLLGameContract.view.lastBet(gameContract)
        console.log("poll last bet")
        console.log(lastBet)
        handleOpenPopup("placed")
        const interval = setInterval(async () => {
            const bet = await FLOWROLLGameContract.view.bets(gameContract, lastBet)
            const [requestId, createdAtBlock, player, bet_, closed, won, numberRolled, payout] = bet;

            console.log("POLLING")

            if (closed) {
                clearInterval(interval)
                setNumberRolled(numberRolled)
                if (bet.won) {
                    setWinAmount(formatEther(payout))
                    handleOpenPopup("won")

                } else {
                    handleOpenPopup("lost")
                }
            }

        }, 1000)

    }



    const handleDeposit = async () => {
        const amount = parseFloat(depositAmount);
        if (amount && amount > 0) {
            setDepositAmount('');

            const provider = await handleNetworkSelect(props.openSnackbar)

            if (!provider) {
                props.openSnackbar("unable to connect wallet")
                return;
            }
            await requestAccounts()

            const gameContract = await getContract(provider, props.gameContractAddress, "/FlowRoll.json")

            if (props.currencyAddress === ZeroAddress) {
                await FLOWROLLGameContract.mutate.fundPrizePoolFlow(gameContract, parseEther(depositAmount))
            } else {
                const erc20Contract = await getContract(provider, props.currencyAddress, "/ERC20.json");
                const signer = await provider.getSigner();
                const address = await signer.getAddress()
                //Check if the allowance covers the deposit
                const allowance = await ERC20Contract.view.allowance(erc20Contract, address, props.gameContractAddress);

                if (allowance < parseEther(depositAmount)) {



                    await ERC20Contract.mutate.approveSpend(erc20Contract, props.gameContractAddress, parseEther(depositAmount)).then(async () => {
                        //After the approval, I deposit
                        await FLOWROLLGameContract.mutate.fundPrizePoolERC20(gameContract, parseEther(depositAmount))
                    })
                } else {
                    //Just deposit without checking allowance stuff
                    await FLOWROLLGameContract.mutate.fundPrizePoolERC20(gameContract, parseEther(depositAmount))
                }

            }


            setIsDepositModalOpen(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <span className="mx-8 text-lg flex flex-row justify-between">
                <div>
                    <span className="font-semibold">{props.name}</span>
                    <span className="mx-2">|</span>
                    <span className="">Token #{props.gameId}</span>
                    <span><CopyLinkButton textToCopy={'https://flowroll.club/games/' + props.gameId}></CopyLinkButton></span>
                </div>
                <span className="right mr-10"><ShareXButton text="Play this game on flow roll club " url={'https://flowroll.club/games/' + props.gameId}></ShareXButton></span>
            </span>
            {/* Main Prize Pool Display */}
            <div className="bg-gradient-to-br  rounded-2xl p-8 shadow-lg border ">


                <div className="flex items-center justify-between">

                    {/* Prize Pool Info */}
                    <div className="flex items-center space-x-4">
                        <div className=" rounded-full">

                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-gray-700 mb-1">Current Prize Pool</h2>
                            <div className="flex items-center space-x-2">
                                <span className="text-4xl font-bold text-gray-900">
                                    {props.prizePool} {props.currency}
                                </span>
                            </div>
                            <div className="flex items-center mt-2 text-sm text-gray-600">
                                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                                <span>Active betting pool</span>
                            </div>
                            <div className="flex items-center mt-2 text-sm text-gray-600">
                                <DollarSign className="w-4 h-4 mr-1 text-yellow-400" />
                                <span>Bet <strong>{props.betAmount} {props.currency}</strong>, Roll Reward: <strong>{props.rollReward} {props.currency}</strong></span>
                            </div>
                            <div className="flex items-center mt-2 text-sm text-gray-600">
                                <Award className="w-4 h-4 mr-1 text-green-500" />
                                <span>Win: {props.winnerPrizeShare}% of the pool, <strong>{props.calculatedReward} {props.currency}</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Deposit Button */}
                    <button
                        onClick={() => setIsDepositModalOpen(true)}
                        className="cursor-pointer font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />

                    </button>
                </div>
                <div className='mt-5 max-w-64'>
                    <DisplayOddsAndPrizePool
                        betMin={props.min}
                        betMax={props.max}
                        betType={props.betType}
                        divider={props.divider}></DisplayOddsAndPrizePool>
                </div>

                {props.betType === "userguess" ?
                    <div className="flex flex-row justify-center">

                        <p>Chose a number between {props.min} and {props.max}</p>
                    </div> : null}

                {
                    props.betType === "divisible" ? <div className="flex flex-row justify-center">

                        <p>The winning numbers are {calculateWinningNumbersList(props.min.toString(), props.max.toString(), props.betType, props.divider)}, the numbers rolled are between {props.min} and {props.max}</p>
                    </div> : null
                }


                {props.betType === "userguess" ?
                    <div className="flex flex-row justify-center">
                        <TextField
                            type={"number"}
                            value={numberToBetOn}
                            id="bet-number"
                            label="Bet on:"
                            variant="filled"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                if (event.target.value !== "") {
                                    if (isNaN(parseInt(event.target.value))) {
                                        return;
                                    }
                                }
                                setNumberToBetOn(event.target.value);
                            }}

                        />
                    </div> : null}
                <AnimatedBettingButtons
                    betType={props.betType}
                    min={props.min}
                    max={props.max}
                    numberToBetOn={props.betType === "userguess" ? parseInt(numberToBetOn) : 0}
                    contractAddress={props.gameContractAddress}
                    betAmount={props.betAmount}
                    tokenAddress={props.currencyAddress}
                    openSnackbar={props.openSnackbar}
                    pollForRollAfterBet={pollForRollAfterBet}
                ></AnimatedBettingButtons>
            </div>

            {/* Deposit Modal */}
            {isDepositModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Add to Prize Pool</h3>
                            <button
                                onClick={() => setIsDepositModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        <p>Donate to the prize pool to incentivize betting</p>

                        {/* Current Pool Display */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-600 mb-1">Current Prize Pool</p>
                            <p className="text-2xl font-bold ">
                                {props.prizePool} {props.currency}
                            </p>
                        </div>
                        {/* Custom Amount Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deposit amount:
                            </label>
                            <div className="relative">
                                {props.currency}
                                <input
                                    type="number"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setIsDepositModalOpen(false)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeposit}
                                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                            >
                                Deposit {depositAmount || '0.00'} {props.currency}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <BetPlacedPopup
                open={openPopups.placed}
                onClose={() => handleClosePopup('placed')}
                betAmount={depositAmount}
            />

            <BetWonPopup
                open={openPopups.won}
                onClose={() => handleClosePopup('won')}
                betAmount={depositAmount}
                winAmount={winAmount}
            />

            <BetLostPopup
                open={openPopups.lost}
                onClose={() => handleClosePopup('lost')}
                betAmount={depositAmount}
            />
        </div>


    );
};

export default PrizePoolDeposit;