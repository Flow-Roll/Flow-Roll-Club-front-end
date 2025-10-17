import { Trophy, Dice1, User, Hash, Clock } from 'lucide-react';
import { calculateWinningNumbersList } from './GameConfiguration';

const BettingCard = ({ game, showBetOn }: any) => {
    const statusColor = game.closed
        ? (game.won ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500')
        : 'bg-blue-100 border-blue-500';

    const statusText = game.closed
        ? (game.won ? 'Won' : 'Lost')
        : 'Pending';

    return (
        <div className={`${statusColor} border-2 rounded-lg p-6 shadow-lg transition-all hover:shadow-xl`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <Hash className="w-5 h-5 text-gray-600" />
                    <span className="font-mono text-sm text-gray-700">
                        {game.requestId.toString().slice(0, 8)}...
                    </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${game.closed
                    ? (game.won ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                    : 'bg-blue-500 text-white'
                    }`}>
                    {statusText}
                </span>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-500">Player:</span>
                    <span className="font-mono text-sm truncate">
                        {game.player.slice(0, 6)}...{game.player.slice(-4)}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Dice1 className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-500">Bet on:</span>
                    {/* If game has a fixed winning number it should show that, or the winning numbers etc.. */}
                    <div className="overflow-auto max-h-20">
                        <span className="font-bold text-lg text-indigo-600">{showBetOn}</span>
                    </div>
                </div>

                {game.closed && (
                    <div className="flex items-center gap-2">
                        <Dice1 className="w-4 h-4 text-gray-600" />
                        <span className="text-xs text-gray-500">Rolled:</span>
                        <span className={`font-bold text-lg ${game.won ? 'text-green-600' : 'text-red-600'}`}>
                            {game.numberRolled}
                        </span>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-xs text-gray-500">Block:</span>
                    <span className="font-mono text-sm">{game.createdAtBlock.toString()}</span>
                </div>

                {game.closed && game.won && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-300">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <span className="text-xs text-gray-500">Payout:</span>
                        <span className="font-bold text-lg text-green-600">
                            {(Number(game.payout) / 1e18).toFixed(4)} FLOW
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};


export default function BettingCardsGrid(props: any) {
    const stats = {
        total: props.lastBetIndex,
        pending: parseInt(props.lastBetIndex) - parseInt(props.lastClosedBetIndex)
    };

    return (
        <div className="min-h-screen bg-gradient-to-br  p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Betting Game Details</h1>
                <p className="text-gray-600 mb-8">See the last few bets and winnings!</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-4 shadow">
                        <div className="text-sm text-gray-500">Total Bets</div>
                        <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow">
                        <div className="text-sm text-gray-500">Pending</div>
                        <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {props.bets.map((bet: any, idx: number) => (
                        <BettingCard key={idx} game={bet} showBetOn={props.betType === "divisible" ? calculateWinningNumbersList(props.min.toString(), props.max.toString(), props.betType, props.divider).join(",") : bet.bet} />
                    ))}
                </div>
            </div>
        </div>
    );
}