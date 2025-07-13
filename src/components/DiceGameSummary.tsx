import { Dice1, Percent, Coins, DollarSign, Code, Target, ArrowUpDown } from 'lucide-react';

const DiceGameSummary = ({
    name,
    couponCode,
    couponPercentage,
    commissionPayment,
    paymentWithoutCoupon,
    paymentWithCoupon,
    tokenAddress,
    winnerPrizeShare,
    diceRollCost,
    houseEdge,
    compensation,
    minimumBet,
    maximumBet,
    betType,
    divider,
    winningNumbersList,
    paymentCurrency
}: any) => {
    const formatPercentage = (percentage: number) => {
        return `${percentage}%`;
    };

    const formatTokenAddress = (address: string) => {
        // if (!address) return 'N/A';
        if (address === "") return "FLOW";
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Dice1 />
                    {name}
                </h1>
                <p className="text-gray-600 mt-1">Summary</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coupon Information */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <h2 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <Code className="w-5 h-5" />
                        Coupon Details
                    </h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Code:</span>
                            <span className="font-mono bg-green-100 px-2 py-1 rounded text-green-800">
                                {couponCode}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Discount:</span>
                            <span className="font-semibold text-green-600">
                                {formatPercentage(couponPercentage)}
                            </span>
                        </div>

                    </div>
                </div>

                {/* Payment Information */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                    <h2 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">

                        <DollarSign className="w-5 h-5" />
                        Payment Details ({paymentCurrency})
                    </h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Without Coupon:</span>
                            <span className="font-semibold">{paymentWithoutCoupon}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">With Coupon:</span>
                            <span className="font-semibold text-green-600">
                                {paymentWithCoupon}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Token & Prize Information */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                    <h2 className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
                        <Coins className="w-5 h-5" />
                        Game Token & Rewards
                    </h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Token Address:</span>
                            <span className="font-mono text-sm bg-purple-100 px-2 py-1 rounded">
                                {formatTokenAddress(tokenAddress)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Winner Prize Share:</span>
                            <span className="font-semibold text-purple-600">
                                {formatPercentage(winnerPrizeShare)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Bet :</span>
                            <span className="font-semibold">{diceRollCost}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Roll Reward:</span>
                            <span className="font-semibold text-green-600">{compensation}</span>
                        </div>
                    </div>
                </div>

                {/* Game Configuration */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                    <h2 className="text-lg font-semibold text-orange-800 mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Game Settings
                    </h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">House Edge:</span>
                            <span className="font-semibold text-orange-600">
                                {formatPercentage(houseEdge)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Min number:</span>
                            <span className="font-semibold">{minimumBet}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Max number:</span>
                            <span className="font-semibold">{maximumBet}</span>
                        </div>

                        {betType !== "divisible" ?
                            <div className="flex justify-between">
                                <span className="text-gray-600">Winning number:</span>
                                <span className="font-semibold capitalize">User must Guess </span>
                            </div> : <div className="flex justify-between flex-wrap">
                                <span className="text-gray-600">Winning numbers:</span>
                                <span className="font-semibold capitalize overflow-scroll hide-scrollbar shadow p-4">{winningNumbersList.join(",")} </span>
                            </div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiceGameSummary;