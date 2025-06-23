import FRCLogo from "/logo2.webp"
// import './App.css'
import "./DiceRollAnimation";
import DiceRollAnimation from './components/DiceRollAnimation'
import WalletSelectHeader from "./components/WalletSelectHeader";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotFoundPage } from "./pages/404Page";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import GamePage from "./pages/GamePage";
import MintPage from "./pages/MintPage";
import LandingPage from "./pages/LandingPage";




//TODO: needs a connect wallet popup  
enum Pages {
  LANDINGPAGE = 0,
  MINTNFT = 1,
  DICEGAME = 2, // Needs to have the ID for the game, dynamic link
  GAMESEARCH = 3 // A page for the indexer that allows users to search games
}

//TODO: Each page should have the same walletSelectAppbar
//The pages should be separate components that each fetch data without connected wallet
//TODO: need to connect wallet to make a bet only
//Need to connect wallet also to roll dice

//TODO: maybe store te app button state in a higher level?
//App button state is about wallet connecting

function App() {

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const openSnackbar = (msg: string) => {
    setSnackbarOpen(true);
    setSnackbarMessage(msg);
  }

  const closeSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  }
  const snackBarAction = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={closeSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const getRoutes = () => {
    return (<BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage></LandingPage>}></Route>
        <Route path="/mint" element={<MintPage></MintPage>}></Route>
        <Route path={"/game/:id"} element={<GamePage></GamePage>}></Route>
        <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
      </Routes>
    </BrowserRouter>)
  }


  return (
    <>
      <Box>
        {getRoutes()}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        message={snackbarMessage}
        action={snackBarAction}
      />
    </>
  )
}

export default App
