import { useParams } from 'react-router-dom';
import BettingPool from '../components/BettingPool';
import DixyDiceAssistant from '../components/Dixy';
import { Stack, Box } from "@mui/material"
import DiceRollHistory from '../components/DiceRollHistory';


export default function GamePage() {
    const { id } = useParams();

    return <div>
        <div>Game ID: {id}</div>
        <Stack height={"70vh"} direction={"column"} justifyContent="space-between">
            <Box><BettingPool gameId={id} /></Box>
            <Box><DixyDiceAssistant /></Box>
            <Box><DiceRollHistory /></Box>
        </Stack>
    </div>;
}
