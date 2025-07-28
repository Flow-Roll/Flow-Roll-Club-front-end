import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { formatEther } from 'ethers';

// Custom Dialog component that mimics MUI Dialog behavior
const Dialog = ({ open, onClose, children, className = '' }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// Individual popup components
const BetPlacedPopup = ({ open, onClose, betAmount }) => (
  <Dialog open={open} onClose={onClose}>
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-2xl shadow-2xl min-w-80 text-center border border-blue-400">
      <div className="mb-4">
        <div className="mb-3 animate-pulse">
          <Clock className="w-16 h-16 mx-auto" />
        </div>
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
      <h2 className="text-2xl font-bold mb-2">Bet Placed!</h2>
      <p className="text-blue-100 mb-4">Your bet is being processed</p>
      {/* <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm">
        <div className="flex items-center justify-center text-lg font-semibold">
          <DollarSign className="w-5 h-5 mr-1" />
          {betAmount}
        </div>
      </div> */}
    </div>
  </Dialog>
);

const BetWonPopup = ({ open, onClose, betAmount, winAmount }) => (
  <Dialog open={open} onClose={onClose}>
    <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-8 rounded-2xl shadow-2xl min-w-80 text-center border border-green-400 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-pulse"></div>
      <div className="relative z-10">
        <div className="mb-4">
          <div className="mb-3 animate-bounce">
            <CheckCircle className="w-16 h-16 mx-auto" />
          </div>
          <TrendingUp className="w-8 h-8 mx-auto text-green-200" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
        <p className="text-green-100 mb-4">You won your bet!</p>
        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm space-y-2">
          {/* <div className="flex justify-between items-center">
            <span className="">Bet Amount:</span>
            <span className="font-semibold">${betAmount}</span>
          </div> */}
          {/* <div className="flex justify-between items-center text-lg font-bold">
            <span>You Won:</span>
            <span className="flex items-center">
              <DollarSign className="w-5 h-5 mr-1" />
              {winAmount}
            </span>
          </div> */}
        </div>
      </div>
    </div>
  </Dialog>
);

const BetLostPopup = ({ open, onClose, betAmount }) => (
  <Dialog open={open} onClose={onClose}>
    <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-8 rounded-2xl shadow-2xl min-w-80 text-center border border-red-400">
      <div className="mb-4">
        <div className="mb-3 animate-pulse">
          <XCircle className="w-16 h-16 mx-auto" />
        </div>
        <TrendingDown className="w-8 h-8 mx-auto text-red-200" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Better Luck Next Time</h2>
      <p className="text-red-100 mb-4">Your bet didn't win this round</p>
      {/* <div className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm mb-4"> */}
        {/* <div className="flex items-center justify-center text-lg">
          <span className="mr-2">Lost:</span>
          <span className="font-semibold flex items-center">
            <DollarSign className="w-5 h-5 mr-1" />
            {betAmount}
          </span>
        </div> */}
      {/* </div> */}
      <div className="text-sm text-red-200">
        Don't give up - try again!
      </div>
    </div>
  </Dialog>
);


export { BetPlacedPopup, BetWonPopup, BetLostPopup };
