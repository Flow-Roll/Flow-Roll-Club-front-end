import React, { useState } from 'react';
import { DollarSign, Dices, Target } from 'lucide-react';

export default function DiceGameParameters() {
    const [parameters, setParameters] = useState({
        prizePool: 1000,
        betAmount: 50,
        winOdds: 16.67 // Default 1 in 6 chance (like rolling a specific number)
    });

    const handleParameterChange = (param, value) => {
        if (param === 'winOdds') {
            setParameters(prev => ({
                ...prev,
                [param]: Math.max(0, Math.min(100, parseFloat(value) || 0))
            }));
        } else {
            setParameters(prev => ({
                ...prev,
                [param]: Math.max(0, parseInt(value) || 0)
            }));
        }
    };

    return (
        <div className="bg-gradient-to-r p-6 rounded-xl shadow-2xl borde">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Game Parameters</h2>

            <div className="flex flex-wrap justify-center gap-6">
                {/* Prize Pool */}
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border ">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 " />
                        <label className="font-semibold text-sm">Prize Pool</label>
                    </div>
                    <input
                        type="number"
                        value={parameters.prizePool}
                        onChange={(e) => handleParameterChange('prizePool', e.target.value)}
                        className="w-full bg-black/50 text-white text-lg font-bold border  rounded px-3 py-2 focus:outline-none focus:ring-2 "
                        min="0"
                    />
                    <div className="text-xs mt-1">${parameters.prizePool.toLocaleString()}</div>
                </div>

                {/* Bet Amount */}
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-yellow-400/50 min-w-[140px]">
                    <div className="flex items-center gap-2 mb-2">
                        <Dices className="w-5 h-5 " />
                        <label className="font-semibold text-sm">Bet Amount</label>
                    </div>
                    <input
                        type="number"
                        value={parameters.betAmount}
                        onChange={(e) => handleParameterChange('betAmount', e.target.value)}
                        className="w-full bg-black/50 text-white text-lg font-bold border border-yellow-400/30 rounded px-3 py-2 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                        min="0"
                    />
                    <div className="text-yellow-300 text-xs mt-1">${parameters.betAmount.toLocaleString()} per bet</div>
                </div>

                {/* Win Odds */}
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-blue-400/50 min-w-[140px]">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-blue-400" />
                        <label className="text-blue-400 font-semibold text-sm">Win Odds</label>
                    </div>
                    <input
                        type="number"
                        value={parameters.winOdds}
                        onChange={(e) => handleParameterChange('winOdds', e.target.value)}
                        className="w-full bg-black/50 text-white text-lg font-bold border border-blue-400/30 rounded px-3 py-2 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                        min="0"
                        max="100"
                        step="0.01"
                    />
                    <div className="text-blue-300 text-xs mt-1">{parameters.winOdds}% chance</div>
                </div>
            </div>

            {/* Game Stats Summary */}
            <div className="mt-6 bg-black/20 rounded-lg p-4 border border-white/20">
                <div className="text-white text-center">
                    <span className="text-gray-300">Expected value: </span>
                    <span className={`font-bold ${(parameters.prizePool * (parameters.winOdds / 100) - parameters.betAmount) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${((parameters.prizePool * (parameters.winOdds / 100) - parameters.betAmount)).toFixed(2)}
                    </span>
                    <span className="text-gray-300 mx-4">•</span>
                    <span className="text-gray-300">House edge: </span>
                    <span className="text-orange-400 font-bold">
                        {(100 - (parameters.prizePool * (parameters.winOdds / 100) / parameters.betAmount * 100)).toFixed(2)}%
                    </span>
                </div>
            </div>
        </div>
    );
}