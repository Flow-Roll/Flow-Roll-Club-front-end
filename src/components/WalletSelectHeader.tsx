import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import IconButton from '@mui/material/IconButton';
import FRCLogo from "/logo2.webp"

export default function WalletSelectHeader() {



    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color='transparent'>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => window.location.href = "/"}
                    >
                        <img src={FRCLogo} alt="Flow Roll Club Logo" width={"70px"} />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Flow Roll Club
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}