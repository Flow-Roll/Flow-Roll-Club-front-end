import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";


import { CONTRACTADDRESSES } from "../web3/contracts";
import { FLOWROLLNFTContract, getContractOnlyView, getJsonRpcProvider } from "../web3/ethers";


export function GamesPage(props: { openSnackbar: CallableFunction }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const task = async () => {
            const provider = getJsonRpcProvider();

            const nftContract = await getContractOnlyView(provider, CONTRACTADDRESSES.FlowRollNFT, "FlowRollNFT.json")

            const count = await FLOWROLLNFTContract.view.count(nftContract)

            setCount(count)
        }

        task()

    }, [])


    return <div>
        <div className="flex flex-row justify-center">
            <DiceGamesTitle openSnackbar={props.openSnackbar} gameCount={count}></DiceGamesTitle>
        </div>
    </div>
}


const DiceGamesTitle = ({ gameCount = 8, openSnackbar }: { gameCount: number, openSnackbar: CallableFunction }) => {

    const [enteredIndex, setEnteredIndex] = useState("0");

    const navigate = useNavigate()

    const DiceIcon = ({ delay = 0 }) => (
        <div
            className={`inline-block text-4xl transition-all duration-1000`}
            style={{ animationDelay: `${delay}ms` }}
        >
            🎲
        </div>
    );

    const goToGameId = () => {
        if (isNaN(parseInt(enteredIndex))) {
            openSnackbar("Invalid game id entered")
            return;
        }

        if (parseInt(enteredIndex) < 0) {
            openSnackbar("Game id must be 0 or bigger")
            return;
        }

        if (parseInt(enteredIndex) >= gameCount) {
            openSnackbar("Game index starts at 0 and there are " + gameCount + " games")
            return;
        }

        navigate(`/games/${enteredIndex}`)

    }

    return (
        <div className="text-center py-8 px-4">
            {/* Main title with gradient */}
            <div className="mb-6">
                <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r  bg-clip-text  mb-2">
                    Bet & Roll
                </h1>
                <div className="flex justify-center items-center gap-2 mb-4">
                    <DiceIcon delay={0} />
                    <DiceIcon delay={200} />
                    <DiceIcon delay={400} />
                </div>
            </div>

            {/* Game count display */}
            <div className="relative">
                <div className="bg-gradient-to-r  rounded-2xl p-6  max-w-md mx-auto">
                    <div className="text-center">
                        <div className="text-lg font-medium mb-2 opacity-90">
                            Choose from
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <span
                                className="text-6xl font-bold cursor-pointer select-none"
                                title="Click to roll the dice!"
                            >
                                {gameCount}
                            </span>
                            <div className="text-left">
                                <div className="text-2xl font-bold">Amazing</div>
                                <div className="text-xl opacity-90">Dice Games!</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="mt-4"></div>

            <TextField
                label="Enter the game id"
                value={enteredIndex}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const newValue = event.target.value;
                    setEnteredIndex(newValue);
                }}
                type="number"
            ></TextField>

            <Button onClick={goToGameId}>Go to game</Button>

        </div >
    );
};


