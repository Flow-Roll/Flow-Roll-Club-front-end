import { Box, Typography } from "@mui/material";
import { useState, useEffect } from 'react';
import {  TrendingDown } from 'lucide-react';

export function NotFoundPage() {

    const quotes = [
        "“If you don’t gamble, you’ll never win.” – Charles Bukowski",
        "“Gambling is a way of buying hope on credit.” – Alan Wykes",
        "“We all get addicted to something that takes away the pain.”",
        "“A dollar won is twice as sweet as a dollar earned.” – Paul Newman",
        "“Oh, it’s not really gambling when you never lose.” – Jennifer Aniston",
        "“Quit while you’re ahead. All the best gamblers do.” – Baltasar Gracián",
        "“If there weren’t luck involved, I would win every time.” – Phil Hellmuth",
        "“At the gambling table, there are no fathers and sons.” – Chinese Proverb",
        "“Gambling is the great leveller. All men are equal at cards.” – Nikolai Gogol",
        "“It’s better to own the casino than being the gambler in the casino.” – Tina Larsson",]


    return <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box component="main" sx={{ flex: 1, py: 6, px: 4, bgcolor: '#eaeff1' }}>
            <Typography variant="h6" component="div">{quotes[Math.floor(Math.random() * 10)
            ]}</Typography>
        </Box>
    </Box>
}

export const GamblingQuotes404 = () => {
    const quotes = [
        "The house always wins... except when you're looking for this page!",
        "I bet you didn't expect to end up here!",
        "The odds of finding this page are about as good as hitting the lottery.",
        "You've rolled snake eyes on this URL!",
        "This page went all-in and lost to a 404 error.",
        "Better luck next time! (But seriously, check your URL)",
        "The cards are telling me... this page doesn't exist.",
        "You've hit the jackpot of missing pages!",
        "This page folded before you could see it.",
        "The wheel of fortune landed on 'Page Not Found'.",
        "Your search has come up empty - time to cash out!",
        "This page is bluffing... it's actually not here.",
        "You've been dealt a bad hand - error 404!",
        "The slot machine of the internet just showed three lemons.",
        "This page went bust faster than a risky poker hand.",
        "Looks like someone pulled the plug on this one-armed bandit!",
        "The roulette ball landed on 'missing page'.",
        "This URL is about as lucky as a broken horseshoe.",
        "You've found the only bet that's guaranteed to lose!",
        "Time to cut your losses and try a different page."
    ];

    const [currentQuote, setCurrentQuote] = useState('');

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setCurrentQuote(quotes[randomIndex]);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">

                {/* Main 404 title */}
                <h1 className="text-8xl font-bold text-transparent bg-black bg-clip-text  animate-pulse">
                    404
                </h1>

                {/* Subtitle */}
                <h2 className="text-3xl font-bold text-white">
                    Page Not Found
                </h2>

                {/* Quote display */}
                <div className="bg-gray-400 bg-opacity-50   rounded-lg p-8 mb-8 shadow-2xl">
                    <div className="text-yellow-400 mb-4">
                        <TrendingDown size={32} className="mx-auto" />
                    </div>
                    <p className="text-xl text-yellow-100 font-semibold leading-relaxed">
                        "{currentQuote}"
                    </p>
                </div>

                {/* Footer text */}
                <p className="text-gray-400 mt-8 text-sm">
                    This is a not found page. NOT FOUND 404
                </p>
            </div>
        </div>
    );
};
