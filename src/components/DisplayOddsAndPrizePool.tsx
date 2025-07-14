function calculateOddsRatio(min: number, max: number) {
    if (min > max) return ""

    const totalOutcomes = max - min + 1;

    // Odds are (losing outcomes) : (winning outcomes)
    const losses = totalOutcomes - 1;
    const wins = 1;

    return `${losses} to ${wins}`;
}

function calculateDivisibleOddsRatio(min: number, max: number, divider: number) {
    const totalOutcomes = max - min + 1;

    // Count how many numbers between min and max are divisible by the divider
    const firstDivisible = Math.ceil(min / divider) * divider;
    const lastDivisible = Math.floor(max / divider) * divider;

    if (firstDivisible > max) {
        return `0 to ${totalOutcomes}`; // No wins possible
    }

    const numWinners = Math.floor((lastDivisible - firstDivisible) / divider) + 1;
    const numLosers = totalOutcomes - numWinners;

    if (isNaN(numLosers) || isNaN(numWinners)) {
        return `Unable to calculate`
    }
    return `${numLosers} to ${numWinners}`;
}

export default function DisplayOddsAndPrizePool({ betMin, betMax, betType, divider }: any) {

    return <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Odds Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Winning Odds</h3>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                </div>
            </div>
            <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">
                    {betType === "divisible" ? calculateDivisibleOddsRatio(betMin, betMax, divider) : calculateOddsRatio(betMin, betMax)}
                </div>
                <div className="text-sm text-gray-600">
                    Losses to Wins
                </div>
            </div>
        </div>
    </div>
}
