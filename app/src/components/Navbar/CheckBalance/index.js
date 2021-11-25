import {Button} from '@material-ui/core';
import {useWallet} from '@solana/wallet-adapter-react';
import React, {FC} from 'react';
import {GetProvider} from '../../Utils/utils';
import {dummyMintPk} from '../../../config/config.js';

const CheckBalance: FC = ({network, balance, setBalance}) => {
    const wallet = useWallet();
    const [provider, connection] = GetProvider(wallet, network);
    const publicKey = provider.wallet.publicKey;
    const networkMap = {
      'https://api.devnet.solana.com': 'DEVNET',
      'https://api.testnet.solana.com': 'TESTNET',
      'http://127.0.0.1:8899': 'LOCALNET'
    }

    async function checkBalance() {
      try {
        const parsedTokenAccountsByOwner = await connection.getParsedTokenAccountsByOwner(provider.wallet.publicKey, { mint: dummyMintPk });
        balance = 1.0 * parsedTokenAccountsByOwner.value[0].account.data.parsed.info.tokenAmount.uiAmount;
      } catch (err) {
        console.log(err);
        balance = 0;
      }
      setBalance(Math.round(balance * 100)/100);
    }

    return (
        <Button variant="contained" className="MuiButton-containedPrimary balance-button credix-button" onClick={checkBalance} disabled={!publicKey} >
            Check balance [{networkMap[network]}]
        </Button>
    );
};

export default CheckBalance;
