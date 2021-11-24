import "./style.scss";

const Footer: FC = () => {
  return (
    <div>
      <div className="footer footer-left">
          <a href="https://github.com/credix-finance/spl-token-faucet" target="_blank" rel="noreferrer">GitHub</a>
      </div>
      <div className="footer footer-right">
        <a href="https://credix.finance" target="_blank" rel="noreferrer">made with ❤ by credix.finance</a>
      </div>
    </div>
  );
}

export default Footer;
