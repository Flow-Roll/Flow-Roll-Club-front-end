import React from 'react';

export default function BettingNumberDisplay(props: { min: number, max: number, bets: string[] | number[] }) {
    return (
        <div className="text-center space-y-6 max-w-64">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200">
                <p className="text-lg text-slate-700 mb-3">
                    The winning numbers are
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                    {props.bets.map((bet, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-2xl w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                        >
                            {bet}
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
                <p className="text-lg text-slate-700">
                    The numbers rolled are between{' '}
                    <span className="font-bold text-slate-900 text-xl">{props.min}</span>
                    {' '}and{' '}
                    <span className="font-bold text-slate-900 text-xl">{props.max}</span>
                </p>
            </div>
        </div>
    );
}