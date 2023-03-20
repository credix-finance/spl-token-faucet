import { Connection } from "@solana/web3.js";
import { AnchorProvider } from "@project-serum/anchor";

export function GetProvider(wallet, network) {
	const opts = {
		preflightCommitment: "processed",
	};
	const connection = new Connection(network, opts.preflightCommitment);
	const provider = new AnchorProvider(
		connection,
		wallet,
		opts.preflightCommitment
	);
	return [provider, connection];
}
