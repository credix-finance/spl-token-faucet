import React, { FC } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-material-ui";
import CheckBalance from "./CheckBalance";
import { useSessionStorage } from "react-use";
import "./style.scss";

const Navbar: FC = ({ tokenName, reload, network }) => {
  const [balance, setBalance] = useSessionStorage("balance");
  const [solBalance, setSolBalance] = useSessionStorage("balance");

  return (
    <div className="navbar-wrapper">
      <div className="notification-bar">
        <p>
          Are you a RUST engineer? Interested in building the future of debt
          capital markets on Solana? Check out
          <a
            href="https://angel.co/company/credix/jobs/1720106-rust-developer-solana"
            target={"_blank"}
          >
            the open positions at Credix.
          </a>
        </p>
      </div>
      <div className="navbar-container">
        <div className="logo-and-tag-line">
          <span className="tag-line">{tokenName}-TOKEN-FAUCET</span>
        </div>
        <div className="balance-wallet-container">
          <WalletMultiButton className="navbar-button credix-button" />
          <CheckBalance
            reload={reload}
            balance={balance}
            setBalance={setBalance}
            solBalance={solBalance}
            setSolBalance={setSolBalance}
            network={network}
            className="navbar-button"
          />
          <div>
            <div className="balance-and-pk">
              <h1>
                Balance: {solBalance} SOL, {balance} {tokenName}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
