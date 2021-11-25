import React, { FC, useMemo, useState } from 'react';
import { WalletDialogProvider } from '@solana/wallet-adapter-material-ui';
import { ConnectionProvider, useLocalStorage, WalletProvider } from '@solana/wallet-adapter-react';
import { getMathWallet, getPhantomWallet, getSolflareWallet, getSolletWallet } from '@solana/wallet-adapter-wallets';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AirDrop from './components/Airdrop';

const App: FC = () => {
  const [network, setNetwork] = useState("https://api.devnet.solana.com");
  const [autoConnect, _setAutoConnect] = useLocalStorage('autoConnect', false);
  const wallets = useMemo(
        () => [
            getPhantomWallet(),
            getSolflareWallet(),
            getMathWallet(),
            getSolletWallet()
        ],
        []
      );

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect={autoConnect}>
        <WalletDialogProvider>
          <Router>
            <Navbar network={network} />
            <AirDrop network={network} setNetwork={setNetwork} />
            <Footer />
          </Router>
        </WalletDialogProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
