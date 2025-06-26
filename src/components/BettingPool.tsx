import { useState } from 'react';
import { Plus, DollarSign, TrendingUp, Award } from 'lucide-react';

const PrizePoolDeposit = (props: { gameId: any }) => {
    console.log(props)
    const [prizePool, setPrizePool] = useState(2450.75);
    const [depositAmount, setDepositAmount] = useState('');
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

    const handleDeposit = () => {
        const amount = parseFloat(depositAmount);
        if (amount && amount > 0) {
            setPrizePool(prev => prev + amount);
            setDepositAmount('');
            setIsDepositModalOpen(false);
        }
    };

    const quickDepositAmounts = [10, 25, 50, 100];

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Main Prize Pool Display */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg border border-blue-200">
                <div className="flex items-center justify-between">
                    {/* Prize Pool Info */}
                    <div className="flex items-center space-x-4">
                        <div className="bg-blue-600 p-3 rounded-full">
                            {/* <Wallet className="w-8 h-8 text-white" /> */}
                        </div>
                        <div>
                            <h2 className="text-lg font-medium text-gray-700 mb-1">Current Prize Pool</h2>
                            <div className="flex items-center space-x-2">
                                <DollarSign className="w-6 h-6 text-green-600" />
                                <span className="text-4xl font-bold text-gray-900">
                                    {prizePool.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex items-center mt-2 text-sm text-gray-600">
                                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                                <span>Active betting pool</span>
                            </div>
                            <div className="flex items-center mt-2 text-sm text-gray-600">
                                <DollarSign className="w-4 h-4 mr-1 text-yellow-400" />
                                <span>Bet $50, Odds: 3/1</span>
                            </div>
                            <div className="flex items-center mt-2 text-sm text-gray-600">
                                <Award className="w-4 h-4 mr-1 text-green-500" />
                                <span>Win: 30% of the pool</span>
                            </div>
                        </div>
                    </div>

                    {/* Deposit Button */}
                    <button
                        onClick={() => setIsDepositModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />
                        {/* <span>Deposit</span> */}
                    </button>
                </div>
            </div>

            {/* Deposit Modal */}
            {isDepositModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Add to Prize Pool</h3>
                            <button
                                onClick={() => setIsDepositModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        {/* Current Pool Display */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-600 mb-1">Current Prize Pool</p>
                            <p className="text-2xl font-bold text-blue-600">
                                ${prizePool.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>

                        {/* Quick Deposit Buttons */}
                        <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">Quick deposit amounts:</p>
                            <div className="grid grid-cols-4 gap-2">
                                {quickDepositAmounts.map(amount => (
                                    <button
                                        key={amount}
                                        onClick={() => setDepositAmount(amount.toString())}
                                        className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 py-2 px-3 rounded-lg transition-colors duration-200 font-medium"
                                    >
                                        ${amount}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Amount Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Custom amount:
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setIsDepositModalOpen(false)}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeposit}
                                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                            >
                                Deposit ${depositAmount || '0.00'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PrizePoolDeposit;