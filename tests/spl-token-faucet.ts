import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
const assert = require("assert");
const { SystemProgram } = anchor.web3;
import { PublicKey } from '@solana/web3.js';
const { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID } = require("@solana/spl-token");
import { SplTokenFaucet } from '../target/types/spl_token_faucet';

describe('spl-token-faucet', () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.SplTokenFaucet as Program<SplTokenFaucet>;

  async function airdropTokens(amount, mintPda, mintPdaBump, receiver, associatedTokenAccount) {
    let amountToAirdrop = new anchor.BN(amount * 1000000);
    await program.rpc.airdrop(
      mintPdaBump,
      amountToAirdrop,
      {
        accounts: {
          payer: program.provider.wallet.publicKey,
          mint: mintPda,
          destination: associatedTokenAccount,
          receiver: receiver, 
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
        },
        signers: [],
      }
    );
  }

  async function getBalance(receiver, mintPda) {
     const parsedTokenAccountsByOwner = await program.provider.connection.getParsedTokenAccountsByOwner(receiver, { mint: mintPda });
     let balance = parsedTokenAccountsByOwner.value[0].account.data.parsed.info.tokenAmount.uiAmount;

     return balance;
  }

  it('Airdrop tokens 2 times and check token account', async () => {
    // Get the PDA that is the mint for the faucet
    const [mintPda, mintPdaBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from(anchor.utils.bytes.utf8.encode("faucet-mint"))],
      program.programId);

    const receiver = new PublicKey("8hpvAu6cq6qzVM4NpXp9bH2uuT4PEYMJvrXKrSd5tdfR"); 

    let associatedTokenAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mintPda,
        receiver,
        true
      );
    // FIRST AIRDROP
    const firstAirdropAmount = 100;
    await airdropTokens(firstAirdropAmount, mintPda, mintPdaBump, receiver, associatedTokenAccount);
    let balance = await getBalance(receiver, mintPda);
    assert.ok(balance == firstAirdropAmount);

    // SECOND AIRDROP
    const secondAirdropAmount = 200;
    await airdropTokens(secondAirdropAmount, mintPda, mintPdaBump, receiver, associatedTokenAccount);
    balance = await getBalance(receiver, mintPda);
    assert.ok(balance == firstAirdropAmount + secondAirdropAmount);

  });
});
