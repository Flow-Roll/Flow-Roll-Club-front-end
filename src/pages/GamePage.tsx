import { useParams } from 'react-router-dom';
import BettingPool from '../components/BettingPool';
import { Stack, Box, Typography, Paper } from "@mui/material"
import DiceRollHistory from '../components/DiceRollHistory';
import AnimatedBettingButtons from '../components/Betbuttons';


export default function GamePage() {
    const { id } = useParams();
    const name = "Lucky 7 raise the dead    "
    return <div className=' mx-auto p-6 '>
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <Typography variant='h1' component="h1" ><strong>{name}</strong></Typography>
            <Typography variant="h2" component="h2"><strong>NFT : {id}</strong></Typography>
        </Box>
        <Box><BettingPool gameId={id} /></Box>
        <AnimatedBettingButtons></AnimatedBettingButtons>
        <Box><DiceRollHistory /></Box>

    </div>;
}
