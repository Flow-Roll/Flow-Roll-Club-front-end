import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GamblingQuotes404 } from "./pages/404Page";

import Snackbar from '@mui/material/Snackbar';
import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import GamePage from "./pages/GamePage";
import LandingPage from "./pages/LandingPage";
import WalletSelectHeader from "./components/WalletSelectHeader";
import MintPage from "./pages/MintPage";
import { GamesPage } from "./pages/GamesPage";
import { FlowProvider } from "@onflow/kit"
import { FLOW_CONFIG } from "./web3/fcl";

//@ts-ignore it is imported!
import flowJSON from "../flow/flow.json"

function App() {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const openSnackbar = (msg: string) => {
    setSnackbarOpen(true);
    setSnackbarMessage(msg);
  }

  React.useEffect(() => {
    openSnackbar("Welcome to Flow Roll Club")
  }, [])


  const closeSnackbar = (_event: React.SyntheticEvent | Event, reason?: string) => {
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
        <Route path="mint" element={<MintPage openSnackbar={openSnackbar}></MintPage>}></Route>
        <Route path={"games/:id"} element={<GamePage></GamePage>}></Route>
        <Route path="games" element={<GamesPage></GamesPage>}></Route>
        <Route path="*" element={<GamblingQuotes404></GamblingQuotes404>}></Route>
      </Routes>
    </BrowserRouter>)
  }


  return (
    <FlowProvider
      config={{
        accessNodeUrl: FLOW_CONFIG.accessNodeURL,
        flowNetwork: FLOW_CONFIG.flowNetwork as "testnet" | "mainnet",
        appDetailTitle: FLOW_CONFIG.appDetailTitle,
        appDetailDescription: FLOW_CONFIG.appDetailDescription,
        appDetailIcon: FLOW_CONFIG.appDetailIcon,
        appDetailUrl: FLOW_CONFIG.appDetailUrl
      }}
      flowJson={flowJSON}
    >
      <Box>
        <WalletSelectHeader></WalletSelectHeader>
        {getRoutes()}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        message={snackbarMessage}
        action={snackBarAction}
      />
    </FlowProvider>
  )
}

export default App
