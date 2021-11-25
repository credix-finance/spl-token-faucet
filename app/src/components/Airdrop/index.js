import {Button} from "@material-ui/core";

const { TOKEN_PROGRAM_ID, Token, ASSOCIATED_TOKEN_PROGRAM_ID } = require("@solana/spl-token");
import {useWallet} from '@solana/wallet-adapter-react';
import {BN, Program, utils, web3} from '@project-serum/anchor';
const { SystemProgram } = web3;
import {useNotify} from '../Utils/notify';
import Select from 'react-select';
import React, {FC, useState} from 'react';
import {GetProvider} from '../Utils/utils';
import {programID, dummyMintPk, dummyMintPkBump} from '../../config/config.js';
import idl from '../../config/spl_token_faucet.json';

import "./style.scss";

const AirDrop: FC = ({network, setNetwork}) => {
    const wallet = useWallet();
    const notify = useNotify();
    const [provider, connection] = GetProvider(wallet, network);
    const publicKey = provider.wallet.publicKey;
    const [selectedOption, setSelectedOption] = useState("https://api.devnet.solana.com");
    const [amount, setAmount] = useState(1000);
    const options = [
      { value: 'https://api.devnet.solana.com', label: 'DEVNET' },
      { value: 'https://api.testnet.solana.com', label: 'TESTNET' },
      { value: 'http://127.0.0.1:8899', label: 'LOCALNET' }
    ]

    const handleChange = (option) => {
      setSelectedOption(option);
      setNetwork(option.value);
    };

    const handleChangeAmount = (event) => {
      setAmount(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await airdropTokens(amount, dummyMintPk, dummyMintPkBump);
    };

    async function airdropTokens(amount, mintPda, mintPdaBump) {
      try {
        const [provider, connection] = GetProvider(wallet, network);
        const program = new Program(idl, programID, provider);
        let amountToAirdrop = new BN(amount * 1000000);

        let associatedTokenAccount = await Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          mintPda,
          provider.wallet.publicKey,
        );

        await program.rpc.airdrop(
          mintPdaBump,
          amountToAirdrop,
          {
            accounts: {
              payer: provider.wallet.publicKey,
              mint: mintPda,
              destination: associatedTokenAccount,
              rent: web3.SYSVAR_RENT_PUBKEY,
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
              associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID
            },
            signers: [],
          }
        );
        notify('success', `Successful airdrop of ${amount} DUMMY`);
      } catch (err) {
        notify('error', `Transaction failed! ${err?.message}`);
      }
    }

    return (
        <div className="airdrop-container">
          <div className="airdrop-wrapper">
            <h3>DUMMY AIRDROP</h3>
            <p>Receive dummy SPL tokens, always coming from the same mint.</p>
            <p>Mint PK: Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr</p>
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
             <form className="form-row">
               <input
                 onChange={handleChangeAmount}
                 defaultValue={1000}
                 type="number"
                 step="100"
                 className="navbar-button stake-input credix-button MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary balance-button"
                />
                <Button
                    variant="contained"
                    className="stake-submit MuiButton-containedPrimary balance-button credix-button"
                    onClick={handleSubmit}
                    disabled={!publicKey}
                >
                 GET DUMMY
                </Button>
             </form>
           </div>
        </div>
    );
};

export default AirDrop;
