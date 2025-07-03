const DiceRollHistory = () => {
    // Sample data for previous dice rolls
    const rollHistory = [
        {
            id: 1,
            player: "0x00Address",
            diceResult: [4, 6],
            bet: 50,
            prediction: "high",
            won: true,
            payout: 100,
            prizePoolChange: -50,
            timestamp: "2 mins ago"
        },
        {
            id: 2,
            player: "0x00Address",
            diceResult: [2, 3],
            bet: 75,
            prediction: "high",
            won: true,
            payout: 150,
            prizePoolChange: -75,
            timestamp: "5 mins ago"
        },
        {
            id: 3,
            player: "0x00Address",
            diceResult: [1, 1],
            bet: 100,
            prediction: "high",
            won: false,
            payout: 0,
            prizePoolChange: 100,
            timestamp: "8 mins ago"
        },
        {
            id: 4,
            player: "0x00Address",
            diceResult: [6, 5],
            bet: 25,
            prediction: "high",
            won: true,
            payout: 50,
            prizePoolChange: -25,
            timestamp: "12 mins ago"
        },
        {
            id: 5,
            player: "0x00Address",
            diceResult: [3, 4],
            bet: 80,
            prediction: "low",
            won: false,
            payout: 0,
            prizePoolChange: 80,
            timestamp: "15 mins ago"
        }
    ];

    const getDiceTotal = (dice: any) => dice.reduce((sum: any, die: any) => sum + die, 0);


    return (
        <div className="max-w-7xl mx-auto py-6 px-4">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Dice Roll History
                </h1>
                <p className="text-gray-600">
                    Recent betting activity and results
                </p>
            </div>

            <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
                    {rollHistory.map((roll) => (
                        <div
                            key={roll.id}
                            className={`min-w-80 max-w-80 bg-white rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-2`}
                        >
                            <div className="p-6">
                                {/* Player Info */}
                                <div className="flex items-center mb-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3`}>
                                        {/* <User className="w-4 h-4 text-white" /> */}
                                        🎲
                                        
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900">
                                            {roll.player}
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-500">
                                            {/* <Clock className="w-3 h-3 mr-1" /> */}
                                            {roll.timestamp}
                                        </div>
                                    </div>
                                </div>

                                {/* Dice Result */}
                                <div className="flex items-center mb-4">
                                    {/* <Dice1 className="w-5 h-5 text-blue-600 mr-2" /> */}
                                    <span className="text-xl font-bold text-gray-900 mr-2">
                                        {roll.diceResult.join(' + ')} = {getDiceTotal(roll.diceResult)}
                                    </span>
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${roll.prediction === 'high'
                                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                                        : 'bg-blue-50 text-blue-700 border-blue-200'
                                        }`}>
                                        {roll.prediction.toUpperCase()}
                                    </span>
                                </div>

                                {/* Bet Information */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Bet Amount</p>
                                        <p className="text-lg font-semibold text-blue-600">
                                            ${roll.bet}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Payout</p>
                                        <p className={`text-lg font-semibold ${roll.won ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            ${roll.payout}
                                        </p>
                                    </div>
                                </div>

                                {/* Result Status */}
                                <div className="flex items-center mb-4">
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full mr-2 ${roll.won
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {roll.won ? 'WON' : 'LOST'}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {roll.won ? `Won $${roll.payout - roll.bet}` : `Lost $${roll.bet}`}
                                    </span>
                                </div>

                                {/* Prize Pool Change */}
                                <div className={`flex items-center justify-between p-3 rounded-lg ${roll.prizePoolChange > 0
                                    ? 'bg-green-50 border border-green-200'
                                    : 'bg-red-50 border border-red-200'
                                    }`}>
                                    <span className="text-sm font-medium text-gray-700">
                                        Prize Pool Change
                                    </span>
                                    <div className="flex items-center">

                                        <span className={`text-sm font-bold ${roll.prizePoolChange > 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {roll.prizePoolChange > 0 ? '+' : ''}${roll.prizePoolChange}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DiceRollHistory;