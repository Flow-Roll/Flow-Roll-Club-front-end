import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import FRCLogo from "/logo2.webp"
import '../web3/fcl'; //The config runs here
import { useState, useEffect } from 'react'
import * as fcl from "@onflow/fcl"

export default function WalletSelectHeader() {

    const [user, setUser] = useState({ loggedIn: null, addr: "" })

    useEffect(() => {
        fcl.currentUser.subscribe(setUser)
    }, [])

    const signIn = () => {
        fcl.logIn()
    }

    const signOut = () => {
        fcl.unauthenticate()
    }

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
                    >
                        <img src={FRCLogo} alt="Flow Roll Club Logo" width={"70px"} />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Flow Roll Club
                    </Typography>
                    <div>
                        {user.loggedIn ? (
                            <div>
                                {/* <p>Address: {user.addr}</p> */}
                                <Button color="inherit" onClick={signOut}>Sign Out</Button>
                            </div>
                        ) : (
                            <Button color="inherit" onClick={signIn}>Connect Wallet</Button>
                        )}
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
}