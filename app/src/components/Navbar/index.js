import React, {FC} from 'react';
import {WalletMultiButton} from '@solana/wallet-adapter-material-ui';
import CheckBalance from './CheckBalance';
import {useSessionStorage} from 'react-use';
import "./style.scss";

const Navbar: FC = ({network}) => {
  const [balance, setBalance] = useSessionStorage('balance');
  const [stake, setStake] = useSessionStorage('stake');

  return (
    <div className="navbar-container">
      <div className="logo-and-tag-line">
        <span className="tag-line">SPL-DUMMY-TOKEN-FAUCET</span>
      </div>
      <div className="balance-wallet-container">
        <WalletMultiButton className="navbar-button credix-button" />
        <CheckBalance balance={balance} setBalance={setBalance} network={network} className="navbar-button" />
        <div>
          <div className="balance-and-pk">
            <h1>Balance: {balance} DUMMY</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
