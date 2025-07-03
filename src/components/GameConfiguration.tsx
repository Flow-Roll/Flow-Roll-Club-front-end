import { useState } from 'react';
import { Dice1, Coins, Trophy, Settings, Zap, Target } from 'lucide-react';

export default function AnimatedBettingForm() {

    //The Mint Cost USD and Mint cost flow are fetched from the smart contract
    //They should be updated when a new coupon code is entered
    const [mintCostUSD, setMintCostUSD] = useState(0);
    const [mintCostFlow,setMintCostFlow] = useState(0);

    const [formData, setFormData] = useState({
        couponCode: '',
        tokenAddress: '',
        winnerPrizeShare: 50,
        diceRollCost: '',
        houseEdge: 2,
        revealCompensation: '',
        betMin: '',
        betMax: '',
        betType: 'userguess',
        divider: 2
    });

    const [errorDisplay, setErrorDisplay] = useState({
        couponError: "",
        tokenAddressError: "",
        winnerPrizeShareError: "",
        diceRollCostError: "",
        houseEdgeError: "",
        revealCompensationError: "",
        betMinError: "",
        betMaxError: "",
        dividerError: ""
    })

    type ErrorField =
        "couponError" |
        "tokenAddressError" |
        "winnerPrizeShareError" |
        "diceRollCostError" |
        "houseEdgeError" |
        "revealCompensationError" |
        "betMinError" |
        "betMaxError" |
        "dividerError"

    const [focusedField, setFocusedField] = useState(null);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Form submitted:', formData);
        // Add your form submission logic here

    };

    function ShowError({ fieldName }: { fieldName: ErrorField }) {
        return (errorDisplay[fieldName] == "" ? <div>
            <p className="text-red-600">{errorDisplay[fieldName]}</p>
        </div> : <div></div>)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="relative">
                <form
                    onSubmit={handleSubmit}
                    className="  backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 max-w-2xl w-full transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl"
                >
                    <div className="text-center mb-8">

                        <h2 className="text-3xl font-bold   mb-2">Betting Configuration</h2>
                        <p className=" /70">Set up your game parameters</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Coupon Code */}
                        <div className="col-span-1 md:col-span-2 shadow p-4">
                            <label className="flex items-center  text-sm font-medium mb-2">
                                <Zap className="w-4 h-4 mr-2" />
                                Coupon Code
                            </label>
                            <input
                                type="text"
                                value={formData.couponCode}
                                onChange={(e) => handleInputChange('couponCode', e.target.value)}
                                onFocus={() => setFocusedField('couponCode')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full px-4 py-3   border rounded-lg   transition-all duration-300 ${focusedField === 'couponCode'
                                    ? 'border-purple-400 ring-4 ring-purple-400/20 transform scale-105'
                                    : 'border-white/30 hover:border-white/50'
                                    }`}
                                placeholder="Enter coupon code"
                            />
                            <label className="text-sm font-medium">The coupon allows you to mint a token for cheaper while paying commission to a third party</label>
                            <ShowError fieldName="couponError"></ShowError>
                        </div>

                        {/* ERC-20 Token Address */}
                        <div className="col-span-1 md:col-span-2 shadow p-4">
                            <label className="flex items-center  /90 text-sm font-medium mb-2">
                                <Coins className="w-4 h-4 mr-2" />
                                ERC-20 Token Address
                            </label>
                            <input
                                type="text"
                                value={formData.tokenAddress}
                                onChange={(e) => handleInputChange('tokenAddress', e.target.value)}
                                onFocus={() => setFocusedField('tokenAddress')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full px-4 py-3   border rounded-lg     transition-all duration-300 ${focusedField === 'tokenAddress'
                                    ? 'border-blue-400 ring-4 ring-blue-400/20 transform scale-105'
                                    : 'border-white/30 hover:border-white/50'
                                    }`}
                                placeholder="0x..."
                            />
                            <p className="text-sm font-medium">Enter an ERC20 token address or leave empty to use FLOW</p>
                            <ShowError fieldName="tokenAddressError"></ShowError>

                        </div>

                        {/* Winner Prize Share */}
                        <div className="shadow p-4">
                            <label className="flex items-center  /90 text-sm font-medium mb-2">
                                <Trophy className="w-4 h-4 mr-2" />
                                Winner Prize Share: {formData.winnerPrizeShare}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={formData.winnerPrizeShare}
                                onChange={(e) => handleInputChange('winnerPrizeShare', parseInt(e.target.value))}
                                className="w-full h-2   rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${formData.winnerPrizeShare}%, rgba(255,255,255,0.2) ${formData.winnerPrizeShare}%, rgba(255,255,255,0.2) 100%)`
                                }}
                            />
                            <p className="text-sm font-medium">The percentage of the whole prize pool paid out to the winner</p>
                            <ShowError fieldName="winnerPrizeShareError"></ShowError>
                        </div>

                        {/* Dice Roll Cost */}
                        <div className="shadow p-4">
                            <label className="flex items-center  /90 text-sm font-medium mb-2">
                                <Dice1 className="w-4 h-4 mr-2" />
                                Fixed Bet Amount
                            </label>
                            <input
                                type="number"
                                value={formData.diceRollCost}
                                onChange={(e) => handleInputChange('diceRollCost', e.target.value)}
                                onFocus={() => setFocusedField('diceRollCost')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full px-4 py-3   border rounded-lg     transition-all duration-300 ${focusedField === 'diceRollCost'
                                    ? 'border-green-400 ring-4 ring-green-400/20 transform scale-105'
                                    : 'border-white/30 hover:border-white/50'
                                    }`}
                                placeholder="0.01"
                                step="0.01"
                            />
                            <p className='text-sm font-medium'>The Bet amount is how much the players will need to deposit per bet.</p>
                            <ShowError fieldName="diceRollCostError"></ShowError>

                        </div>

                        {/* House Edge */}
                        <div className="shadow p-4">
                            <label className="flex items-center  /90 text-sm font-medium mb-2">
                                <Settings className="w-4 h-4 mr-2" />
                                House Edge: {formData.houseEdge}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="30"
                                step="1"
                                value={formData.houseEdge}
                                onChange={(e) => handleInputChange('houseEdge', parseFloat(e.target.value))}
                                className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                                style={{
                                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${formData.houseEdge * 3}%, rgba(255,255,255,0.2) ${formData.houseEdge * 3}%, rgba(255,255,255,0.2) 100%)`
                                }}
                            />
                            <p className='text-sm font-medium'>The percentage the house takes from the win or loss. The NFT owner is transferred this on each roll. There is a protocol fee on the house edge.</p>
                            <ShowError fieldName="houseEdgeError"></ShowError>
                        </div>

                        {/* Reveal Compensation */}
                        <div className="shadow p-4">
                            <label className="flex items-center  /90 text-sm font-medium mb-2">
                                <Target className="w-4 h-4 mr-2" />
                                Roll Reward
                            </label>
                            <input
                                type="number"
                                value={formData.revealCompensation}
                                onChange={(e) => handleInputChange('revealCompensation', e.target.value)}
                                onFocus={() => setFocusedField('revealCompensation')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full px-4 py-3   border rounded-lg     transition-all duration-300 ${focusedField === 'revealCompensation'
                                    ? 'border-yellow-400 ring-4 ring-yellow-400/20 transform scale-105'
                                    : 'border-white/30 hover:border-white/50'
                                    }`}
                                placeholder="0.001"
                                step="0.001"
                            />
                            <p className='text-sm font-medium'>The reward is sent to rollers, it keeps the game going. It's taken from each win or loss. The amount is always in the configured token. This is an incentive that keeps the game going. Example: When using Flow, 0.1 FLOW for rolling is an adequate reward because it exceeds the gas fee.</p>
                            <ShowError fieldName="revealCompensationError"></ShowError>
                        </div>

                        {/* Bet Min */}
                        <div className="shadow p-4">
                            <label className=" /90 text-sm font-medium mb-2 block">
                                Bet Min
                            </label>
                            <input
                                type="number"
                                value={formData.betMin}
                                onChange={(e) => handleInputChange('betMin', e.target.value)}
                                onFocus={() => setFocusedField('betMin')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full px-4 py-3   border rounded-lg     transition-all duration-300 ${focusedField === 'betMin'
                                    ? 'border-red-400 ring-4 ring-red-400/20 transform scale-105'
                                    : 'border-white/30 hover:border-white/50'
                                    }`}
                                placeholder="1"
                                step="1"
                            />
                            <p className="text-sm font-medium">The minimum number to bet on</p>
                            <ShowError fieldName="betMinError"></ShowError>
                        </div>

                        {/* Bet Max */}
                        <div className="text-sm font-medium">
                            <label className=" /90 text-sm font-medium mb-2 block">
                                Bet Max
                            </label>
                            <input
                                type="number"
                                value={formData.betMax}
                                onChange={(e) => handleInputChange('betMax', e.target.value)}
                                onFocus={() => setFocusedField('betMax')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full px-4 py-3   border rounded-lg     transition-all duration-300 ${focusedField === 'betMax'
                                    ? 'border-orange-400 ring-4 ring-orange-400/20 transform scale-105'
                                    : 'border-white/30 hover:border-white/50'
                                    }`}
                                placeholder="6"
                                step="1"
                            />
                            <p className="text-sm font-medium" >The maximum number to bet on</p>
                            <ShowError fieldName="betMaxError"></ShowError>
                        </div>

                        {/* Bet Type */}
                        <div className="shadow p-4">
                            <label className=" text-sm font-medium mb-2 block">
                                Bet Type
                            </label>
                            <select
                                value={formData.betType}
                                onChange={(e) => handleInputChange('betType', e.target.value)}
                                onFocus={() => setFocusedField('betType')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full px-4 py-3   border rounded-lg   transition-all duration-300 ${focusedField === 'betType'
                                    ? 'border-pink-400 ring-4 ring-pink-400/20 transform scale-105'
                                    : 'border-white/30 hover:border-white/50'
                                    }`}
                            >
                                <option value="userguess" className="">Exact Guess</option>
                                <option value="divisible" className="">Divisible By</option>

                            </select>
                            <p className="text-sm font-medium">The bet type is either a user specified number or the user get a number that is divisible without a remainder by the supplied number</p>
                        </div>
                    </div>

                    {formData.betType == "divisible" ?

                        <div className="shadow p-4">
                            <label className=" text-sm font-medium mb-2 block">
                                Divider
                            </label>
                            <input
                                type="number"
                                value={formData.divider}
                                onChange={(e) => handleInputChange('divider', e.target.value)}
                                onFocus={() => setFocusedField('divider')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full px-4 py-3   border rounded-lg     transition-all duration-300 ${focusedField === 'betMax'
                                    ? 'border-orange-400 ring-4 ring-orange-400/20 transform scale-105'
                                    : 'border-white/30 hover:border-white/50'
                                    }`}
                                placeholder="6"
                                step="1"
                            />
                            <p className="text-sm font-medium" >The divider specifies what numbers are winners. E.G: Enter 5 to make every number divisible by 5 a winner. You can't use 0 or 1 and it must be between min and max.</p>
                            <ShowError fieldName="dividerError"></ShowError>
                        </div>
                        : <div></div>}



                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-8 border cursor-pointer       py-4 px-6 rounded-lg font-semibold text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-400/50"
                    >
                        <span className="flex items-center justify-center">
                            <Dice1 className="w-5 h-5 mr-2 animate-spin" />
                            Mint Game
                        </span>
                    </button>
                </form>
            </div>

            <style >{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
}