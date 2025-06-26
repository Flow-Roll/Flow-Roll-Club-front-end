import { useState } from 'react';

export const PlayfulPlayButton = ({ onClick = () => { }, disabled = false }) => {
    const [isPressed, setIsPressed] = useState(false);

    const handleClick = () => {
        setIsPressed(true);
        setTimeout(() => setIsPressed(false), 300);
        onClick();
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={`
        relative overflow-hidden
        bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
        hover:from-purple-600 hover:via-pink-600 hover:to-red-600
        text-white font-bold text-3xl
        px-12 py-6 rounded-3xl
        transform transition-all duration-300 ease-out
        active:scale-95 active:rotate-0
        shadow-lg hover:shadow-2xl
        border-2 border-white/20
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        group
        ${isPressed ? 'animate-pulse' : ''}
      `}
        >
            {/* Animated background sparkles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-3 left-6 w-3 h-3 bg-white/60 rounded-full animate-ping"></div>
                <div className="absolute top-6 right-8 w-2.5 h-2.5 bg-yellow-300/80 rounded-full animate-ping delay-150"></div>
                <div className="absolute bottom-4 left-12 w-2 h-2 bg-cyan-300/70 rounded-full animate-ping delay-300"></div>
                <div className="absolute bottom-3 right-6 w-2.5 h-2.5 bg-emerald-300/60 rounded-full animate-ping delay-500"></div>
            </div>

            {/* Main content container */}
            <div className="relative flex items-center justify-center gap-3">


                {/* Play Text */}
                <span className={`
          font-black tracking-wider drop-shadow-lg
          transition-all duration-300
          ${isPressed ? 'scale-110' : 'group-hover:scale-105'}
        `}>
                    PLAY
                </span>

                {/* Trailing sparkle effect */}
                <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex space-x-1.5">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping delay-100"></div>
                        <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping delay-200"></div>
                        <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping delay-300"></div>
                    </div>
                </div>
            </div>

            {/* Ripple effect on click */}
            {isPressed && (
                <div className="absolute inset-0 rounded-2xl">
                    <div className="absolute inset-0 bg-white/30 rounded-2xl animate-ping"></div>
                </div>
            )}

            {/* Bottom glow effect */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-red-500/50 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
    );
};
