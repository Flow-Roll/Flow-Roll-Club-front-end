import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function FlowRollClubTitle() {
    const [isRolling, setIsRolling] = useState(false);
    const [diceValue, setDiceValue] = useState(6);

    const navigate = useNavigate();

    const rollDice = () => {
        setIsRolling(true);
        setTimeout(() => {
            setDiceValue(Math.floor(Math.random() * 6) + 1);
            setIsRolling(false);
        }, 800);
    };

    const getDiceDots = (value: any) => {
        const dotPositions: any = {
            1: ['center'],
            2: ['top-left', 'bottom-right'],
            3: ['top-left', 'center', 'bottom-right'],
            4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
            5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
            6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
        };

        return dotPositions[value] || [];
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
            <div className="text-center">
                <h1 className="text-6xl md:text-8xl font-black text-gray-800 mb-8 transform hover:scale-105 transition-transform duration-300">
                    <span className="inline-block animate-bounce" style={{ animationDelay: '0s' }}>W</span>
                    <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>e</span>
                    <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>l</span>
                    <span className="inline-block animate-bounce" style={{ animationDelay: '0.3s' }}>c</span>
                    <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>o</span>
                    <span className="inline-block animate-bounce" style={{ animationDelay: '0.5s' }}>m</span>
                    <span className="inline-block animate-bounce" style={{ animationDelay: '0.6s' }}>e</span>
                    <span className="mx-4 inline-block animate-bounce" style={{ animationDelay: '0.7s' }}>t</span>
                    <span className="inline-block animate-bounce" style={{ animationDelay: '0.8s' }}>o</span>
                </h1>

                <div className="flex items-center justify-center gap-6 mb-8">
                    <h2 className="text-4xl md:text-6xl font-bold drop-shadow-lg" style={{ color: '#00fdc8' }}>
                        Flow Roll Club
                    </h2>

                    <button
                        onClick={rollDice}
                        className={`relative w-20 h-20 bg-white rounded-xl shadow-2xl cursor-pointer transform transition-all duration-300 hover:scale-110 ${isRolling ? 'animate-spin' : 'hover:rotate-12'
                            }`}
                        style={{
                            perspective: '1000px',
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        <div className="absolute inset-2 grid grid-cols-3 grid-rows-3 gap-1">
                            {Array.from({ length: 9 }).map((_, index) => {
                                const positions: any = {
                                    'top-left': 0,
                                    'top-right': 2,
                                    'middle-left': 3,
                                    'center': 4,
                                    'middle-right': 5,
                                    'bottom-left': 6,
                                    'bottom-right': 8
                                };

                                const activeDots = getDiceDots(diceValue);
                                const positionName = Object.keys(positions).find(key => positions[key] === index);
                                const isActive = activeDots.includes(positionName);

                                return (
                                    <div
                                        key={index}
                                        className={`rounded-full transition-all duration-300 ${isActive
                                            ? 'bg-gray-800 scale-100'
                                            : 'bg-transparent scale-0'
                                            }`}
                                    />
                                );
                            })}
                        </div>
                    </button>
                </div>

                <p className="text-xl md:text-2xl text-gray-600 font-medium tracking-wide">
                    Tokenized and Perpetual Dice Games. Trustless and Verifiable 🎲✨
                </p>

                <div className="mt-8 flex flex-col items-center gap-4">

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="px-8 py-4 text-lg font-bold text-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer"
                            style={{ backgroundColor: '#00fdc8' }}
                            onClick={() => navigate("/mint")}
                            onMouseEnter={(e: any) => e.target.style.backgroundColor = '#00e6b3'}
                            onMouseLeave={(e: any) => e.target.style.backgroundColor = '#00fdc8'}>
                            <div className="flex flex-col items-center">
                                <span className="text-xl">🎲 Mint</span>
                                <span className="text-base">Create your own Dice Game NFT</span>
                                <span className="text-sm font-semibold mt-1">Become the House</span>
                            </div>
                        </button>

                        <button className="px-8 py-4 text-lg font-bold text-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 cursor-pointer"
                            style={{ backgroundColor: '#6366f1' }}
                            onClick={() => navigate("/games")}
                            onMouseEnter={(e: any) => e.target.style.backgroundColor = '#5855eb'}
                            onMouseLeave={(e: any) => e.target.style.backgroundColor = '#6366f1'}>
                            <div className="flex flex-col items-center">
                                <span className="text-xl">🎯 Find Games</span>
                                <span className="text-base">Join existing dice games</span>
                                <span className="text-sm font-semibold mt-1">Start Playing</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}