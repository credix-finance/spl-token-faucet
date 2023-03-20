const anchor = require("@project-serum/anchor");
const {
	TOKEN_PROGRAM_ID,
	Token,
	ASSOCIATED_TOKEN_PROGRAM_ID,
} = require("@solana/spl-token");
const { SystemProgram, PublicKey } = anchor.web3;

// This will always use the key on ~/.config/solana/id.json
let provider = anchor.Provider.env();
anchor.setProvider(provider);
const program = anchor.workspace.SplTokenFaucet;

const amount = 10000;

async function airdrop_usdc() {
	console.log("provider address: " + provider.wallet.publicKey.toString());
	console.log("payer address: " + provider.wallet.publicKey.toString());

	const amountToAirdrop = new anchor.BN(amount * 1000000);

	console.log(program.programId);
	// Get the PDA that is the mint for the faucet
	const [mintPda, mintPdaBump] =
		await anchor.web3.PublicKey.findProgramAddressSync(
			[Buffer.from(anchor.utils.bytes.utf8.encode("faucet-mint"))],
			program.programId
		);

	// Get associated token account
	const associatedTokenAccount = await Token.getAssociatedTokenAddress(
		ASSOCIATED_TOKEN_PROGRAM_ID,
		TOKEN_PROGRAM_ID,
		mintPda,
		program.provider.wallet.publicKey
	);

	const tx = await program.rpc.airdrop(mintPdaBump, amountToAirdrop, {
		accounts: {
			receiver: program.provider.wallet.publicKey,
			payer: program.provider.wallet.publicKey,
			mint: mintPda,
			destination: associatedTokenAccount,
			rent: anchor.web3.SYSVAR_RENT_PUBKEY,
			tokenProgram: TOKEN_PROGRAM_ID,
			systemProgram: SystemProgram.programId,
			associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
		},
		signers: [],
	});
	console.log("Your transaction signature", tx);
}

airdrop_usdc();
