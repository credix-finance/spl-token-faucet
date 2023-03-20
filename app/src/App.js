import React, { FC, useMemo, useState } from "react";
import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";
import {
	ConnectionProvider,
	useLocalStorage,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AirDrop from "./components/Airdrop";

const App: FC = () => {
	const [network, setNetwork] = useState("https://api.devnet.solana.com");
	const [reload, setReload] = useState(true);
	const [autoConnect, _setAutoConnect] = useLocalStorage("autoConnect", false);
	const search = window.location.search;
	const params = new URLSearchParams(search);
	let tokenName = params.get("token-name");
	if (!tokenName) {
		tokenName = "DUMMY";
	}

	const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

	return (
		<ConnectionProvider endpoint={network}>
			<WalletProvider wallets={wallets} autoConnect={autoConnect}>
				<WalletDialogProvider>
					<Router>
						<Navbar tokenName={tokenName} reload={reload} network={network} />
						<AirDrop
							tokenName={tokenName}
							reload={reload}
							setReload={setReload}
							network={network}
							setNetwork={setNetwork}
						/>
						<Footer />
					</Router>
				</WalletDialogProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
};

export default App;
