import { Box, Typography } from "@mui/material";

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