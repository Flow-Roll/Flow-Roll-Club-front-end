
export const MintButton = ({ subtitle = "Create your Dice Game NFT Become the House ", onClicked }: { subtitle?: string, onClicked: CallableFunction }) => {
    return (
        <div className="relative max-w-sm mx-auto mt-2" onClick={() => { onClicked() }}>
            {/* Main Card */}
            <div className="bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-3xl p-8 shadow-2xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 ease-bounce cursor-pointer group">

                {/* Floating particles */}
                <div className="absolute top-4 left-4 w-3 h-3 bg-white/30 rounded-full animate-bounce"></div>
                <div className="absolute top-8 right-6 w-2 h-2 bg-yellow-300/50 rounded-full animate-bounce delay-150"></div>
                <div className="absolute bottom-6 left-6 w-2 h-2 bg-pink-300/40 rounded-full animate-bounce delay-300"></div>

                {/* Main Text */}
                <div className="text-center">
                    <h1 className="select-none text-6xl font-black text-white mb-2 tracking-wider transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                        MINT
                    </h1>

                    <p className="select-none text-white/90 text-lg font-semibold tracking-wide">
                        {subtitle}
                    </p>
                </div>

                {/* Bottom decorative line */}
                <div className="mt-6 flex justify-center">
                    <div className="w-16 h-1 bg-white/40 rounded-full group-hover:w-24 transition-all duration-300"></div>
                </div>
            </div>

            {/* Shadow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-cyan-700 rounded-3xl blur-xl opacity-30 -z-10 transform translate-y-4"></div>
        </div>
    );
};