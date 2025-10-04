import { useState } from 'react';
import { DollarSign, Dice6 } from 'lucide-react';
import { handleNetworkSelect, requestAccounts } from '../web3/web3';
import { parseEther, ZeroAddress } from 'ethers';
import { ERC20Contract, FLOWROLLGameContract, getContract } from '../web3/ethers';

export default function AnimatedBettingButtons(props: {
    contractAddress: string,
    betAmount: string,
    tokenAddress: string,
    openSnackbar: (message: string) => void,
    numberToBetOn: number,
    min: number,
    max: number,
    betType: string,
    pollForRollAfterBet: CallableFunction
}) {
    const [betPressed, setBetPressed] = useState(false);
    const [rollPressed, setRollPressed] = useState(false);
    const [isRolling, setIsRolling] = useState(false);

    const handleBet = async () => {

        if (props.betType === "userguess") {

            if (props.numberToBetOn < props.min) {
                props.openSnackbar("Your number is less than minimum")
                return
            }
            if (props.numberToBetOn > props.max) {
                props.openSnackbar("Your number is more than the maximum")
                return
            }
        }


        setBetPressed(true);
        setTimeout(() => setBetPressed(false), 200);
        console.log('Bet placed!');
        const provider = await handleNetworkSelect(props.openSnackbar)

        if (!provider) {
            props.openSnackbar("unable to connect wallet")
            return;
        }
        await requestAccounts()

        const gameContract = await getContract(provider, props.contractAddress, "/FlowRoll.json")

        if (props.tokenAddress === ZeroAddress) {
            //It's flow
            await FLOWROLLGameContract.mutate.betFlow(gameContract, props.numberToBetOn, parseEther(props.betAmount)).then(async () => {
                await props.pollForRollAfterBet(gameContract)
            }).catch((err) => {
                console.error(err)
                props.openSnackbar("Unable to submit transaction")
            })


        } else {

            //Need to check allowance and then bet
            const erc20Contract = await getContract(provider, props.tokenAddress, "/ERC20.json");
            const signer = await provider.getSigner();
            const address = await signer.getAddress()
            //Check if the allowance covers the deposit
            const allowance = await ERC20Contract.view.allowance(erc20Contract, address, props.contractAddress);

            if (allowance < parseEther(props.betAmount)) {

                await ERC20Contract.mutate.approveSpend(erc20Contract, props.contractAddress, parseEther(props.betAmount)).then(async () => {
                    //After the approval, I deposit
                    await FLOWROLLGameContract.mutate.betERC20(gameContract, parseEther(props.betAmount), props.numberToBetOn).then(async () => {
                        await props.pollForRollAfterBet(gameContract)
                    }).catch((_err: any) => {
                        props.openSnackbar("Unable to submit transaction")
                    })
                }).catch((_err: any) => {
                    props.openSnackbar("Unable to approve spend")
                })
            } else {
                //Just deposit without checking allowance stuff
                await FLOWROLLGameContract.mutate.betERC20(gameContract, parseEther(props.betAmount), props.numberToBetOn).then(async () => {
                    await props.pollForRollAfterBet(gameContract)
                }).catch((_err: any) => {
                    props.openSnackbar("Unable to submit transaction")
                })
            }
        }
    };

    const handleRoll = async () => {
        setRollPressed(true);
        setIsRolling(true);
        setTimeout(() => {
            setRollPressed(false);
            setIsRolling(false);
        }, 1000);
        console.log('Rolling dice!');
        const provider = await handleNetworkSelect(props.openSnackbar)

        if (!provider) {
            props.openSnackbar("unable to connect wallet")
            return;
        }
        await requestAccounts()

        const gameContract = await getContract(provider, props.contractAddress, "/FlowRoll.json")

        const lastBet = await FLOWROLLGameContract.view.lastBet(gameContract)

        const lastClosedBet = await FLOWROLLGameContract.view.lastClosedBet(gameContract);

        if (lastBet === lastClosedBet) {
            props.openSnackbar("There are no bets to roll for")
            return;
        }

        await FLOWROLLGameContract.mutate.revealDiceRoll(gameContract).catch((_err: any) => {
            props.openSnackbar("Unable to submit transaction")
        })

    };

    return (
        <div className="flex gap-8 p-8 justify-center    ">
            {/* Bet Button */}
            <button
                onClick={handleBet}
                className={`
            relative group px-8 py-4 min-w-[140px] h-16
            bg-gradient-to-r from-emerald-500 to-green-600
            hover:from-emerald-400 hover:to-green-500
            text-white font-bold text-lg rounded-xl
            transform transition-all duration-200 ease-out
            hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/50
            active:scale-95
            ${betPressed ? 'scale-95' : ''}
            shadow-lg shadow-emerald-600/30
            border-2 border-emerald-400/30
            overflow-hidden
            cursor-pointer
          `}
            >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                <div className="flex items-center justify-center gap-2 relative z-10">
                    <DollarSign
                        className={`w-6 h-6 transition-transform duration-200 ${betPressed ? 'scale-125' : 'group-hover:scale-110'
                            }`}
                    />
                    <span>BET</span>
                </div>

                {/* Pulse effect */}
                <div className={`
            absolute inset-0 rounded-xl border-2 border-emerald-300
            ${betPressed ? 'animate-ping' : 'opacity-0'}
          `} />
            </button>

            {/* Roll Button */}
            <button
                onClick={handleRoll}

                className={`
            relative group px-8 py-4 min-w-[140px] h-16
            bg-gradient-to-r from-orange-500 to-red-600
            hover:from-orange-400 hover:to-red-500
            text-white font-bold text-lg rounded-xl
            transform transition-all duration-200 ease-out
            hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50
            active:scale-95
            ${rollPressed ? 'scale-95' : ''}
            shadow-lg shadow-orange-600/30
            border-2 border-orange-400/30
            overflow-hidden
            cursor-pointer
            
          `}
            >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                <div className="flex items-center justify-center gap-2 relative z-10">
                    <Dice6
                        className={`w-6 h-6 transition-transform duration-200 ${isRolling ? 'animate-spin' : rollPressed ? 'scale-125' : 'group-hover:scale-110'
                            }`}
                    />
                    <span>ROLL</span>
                </div>

                {/* Pulse effect */}
                <div className={`
            absolute inset-0 rounded-xl border-2 border-orange-300
            ${rollPressed ? 'animate-ping' : 'opacity-0'}
          `} />
            </button>
        </div>

    );
}