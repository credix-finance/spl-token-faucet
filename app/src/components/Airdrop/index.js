import {Button} from "@material-ui/core";
import { LAMPORTS_PER_SOL, TransactionSignature, PublicKey } from '@solana/web3.js';
const { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID } = require("@solana/spl-token");
import {useWallet} from '@solana/wallet-adapter-react';
import {BN, Program, utils, web3} from '@project-serum/anchor';
const { SystemProgram } = web3;
import {useNotify} from '../Utils/notify';
import Select from 'react-select';
import React, {FC, useState, useEffect} from 'react';
import {GetProvider} from '../Utils/utils';
import {programID, dummyMintPk, dummyMintPkBump} from '../../config/config.js';
import idl from '../../config/spl_token_faucet.json';

import "./style.scss";

const AirDrop: FC = ({tokenName, reload, setReload, network, setNetwork}) => {
  const wallet = useWallet();
  const notify = useNotify();
  const [provider, connection] = GetProvider(wallet, network);
  const publicKey = provider.wallet.publicKey;
  const [selectedOption, setSelectedOption] = useState("https://api.devnet.solana.com");
  const [airdropPk, setAirdropPk] = useState("CONNECT WALLET");
  const [splAmount, setSplAmount] = useState(1000);
  const options = [
    { value: 'https://api.devnet.solana.com', label: 'DEVNET' },
    { value: 'https://api.testnet.solana.com', label: 'TESTNET' },
    { value: 'http://127.0.0.1:8899', label: 'LOCALNET' }
  ]

  useEffect(() => {
    if(wallet.publicKey) {
        setAirdropPk(wallet.publicKey.toString()); 
    }
  }, [wallet.publicKey]);

  const handleChange = (option) => {
    setSelectedOption(option);
    setNetwork(option.value);
    setReload(!reload);
  };

  const handleChangeSplAmount = (event) => {
    setSplAmount(event.target.value);
  }

  const handleChangeAirdropPk = (event) => {
    setAirdropPk(event.target.value);
  };

  const handleFocusAirdropPk = (event) => {
    setAirdropPk("");
  }

  const handleSubmitSpl = async (event) => {
    event.preventDefault();
    await airdropSplTokens(splAmount, dummyMintPk, dummyMintPkBump);
  };

  const handleSubmitSol = async (event) => {
    const [provider, connection] = GetProvider(wallet, network);
    let signature = '';
    try { 
      signature = await connection.requestAirdrop(new PublicKey(airdropPk), LAMPORTS_PER_SOL);
      notify('info', 'SOL airdrop requested:', signature, network);
      await connection.confirmTransaction(signature, 'processed');
      notify('success', 'SOL airdrop successful!', signature, network);
      setReload(!reload);
    } catch (err) {
      notify('error', `Airdrop failed! ${err?.message}`, signature, network);
    }
  };

  async function airdropSplTokens(amount, mintPda, mintPdaBump) {
    let signature = '';
    try {
      const [provider, connection] = GetProvider(wallet, network);
      const program = new Program(idl, programID, provider);
      const receiver = new PublicKey(airdropPk);
      let amountToAirdrop = new BN(amount * 1000000);

      let associatedTokenAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mintPda,
        receiver,
        true
      );

      signature = await program.rpc.airdrop(
        mintPdaBump,
        amountToAirdrop,
        {
          accounts: {
            mint: mintPda,
            destination: associatedTokenAccount,
            payer: provider.wallet.publicKey,
            receiver: receiver, 
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            rent: web3.SYSVAR_RENT_PUBKEY
          },
          signers: [],
        }
      );
      notify('info', `${tokenName} Airdrop requested:`, signature, network);
      await connection.confirmTransaction(signature, 'processed');
      notify('success', `${tokenName} Airdrop successful!`, signature, network);
      setReload(!reload);
    } catch (err) {
      notify('error', `${tokenName} Airdrop failed! ${err?.message}`, signature, network);
    }
  }

  return (
    <div className="airdrop-container">
      <div className="airdrop-wrapper">
        <h3>Network selection</h3>
        <div className="network-dropdown-wrapper">
          <Select
            className="network-dropdown navbar-button react-select-container"
            classNamePrefix="react-select"
            onChange={handleChange}
            defaultValue={options[0]}
            options={options}
            menuPlacement="auto"
            menuPosition="fixed"
            isSearchable={false}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary: 'black',
                primary25: "#f0f0f0"
              },
            })}
           />
         </div>
        <h3>Address for airdrop</h3>
        <p>The address the SOL and {tokenName} will be sent to.</p>
        <input
          name="airdropPk"
          type="text"
          value={airdropPk}
          onChange={handleChangeAirdropPk}
          onFocus={handleFocusAirdropPk}
          disabled={!publicKey}
          className="airdrop-pk-input stake-input borrower-pk credix-button MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary balance-button"
        />
        <h3>SOL airdrop</h3>
        <p>Receive 1 SOL; you will need this to pay for transaction fees.</p>
        <Button
            variant="contained"
            className="stake-submit MuiButton-containedPrimary balance-button credix-button sol-airdrop"
            onClick={handleSubmitSol}
            disabled={!publicKey}
        >
         GET 1 SOL
        </Button>
        <h3>{tokenName} airdrop</h3>
        <p>Receive dummy SPL tokens, always coming from the same mint.</p>
        <p>Mint PK: Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr</p>
         <form className="form-row">
           <input
             onChange={handleChangeSplAmount}
             defaultValue={1000}
             type="number"
             step="100"
             disabled={!publicKey}
             className="navbar-button stake-input credix-button MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary balance-button"
            />
            <Button
                variant="contained"
                className="stake-submit MuiButton-containedPrimary balance-button credix-button"
                onClick={handleSubmitSpl}
                disabled={!publicKey}
            >
             GET {tokenName}
            </Button>
         </form>
         <h3>Customize this faucet</h3>
         <p>Give DUMMY a different name: <a href="https://spl-token-faucet.com?token-name=USDC" target="_blank">spl-token-faucet.com?token-name=USDC</a></p>
       </div>
    </div>
  );
};

export default AirDrop;
