import { Stack } from "@mui/material";

import FlowRollClubTitle from "../components/WelcomeComponent";

export default function LandingPage() {
    return <Stack height={"70vh"} direction={"column"} justifyContent="space-between">
        <div>
            <FlowRollClubTitle></FlowRollClubTitle>
        </div>
    </Stack>
}