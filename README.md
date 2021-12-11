# SPL token faucet
This project aims at implementing an SPL token faucet in its simplest form using Anchor. Faucets are a must-have when developing dApps to test out token flows. A faucet allows you to receive an arbitrary amount of tokens; always coming from the same Mint. At Credix, we use this faucet to "mimic" USDC on testnet and devnet (as the USDC faucet is only available on testnet AND only allows 5USDC per IP, which is very limiting). The program is deployed on both testnet and devnet at `4sN8PnN2ki2W4TFXAfzR645FWs8nimmsYeNtxM8RBK6A` and the Mints PK is `Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr` on both networks.

A reference UI has been implemented to make it easy for your end-users to get DUMMY tokens and use those in your application. The code for this reference UI can be found in the App folder. The hosted version can be found [here](https://spl-token-faucet.com/).

Using the query parameter `token-name`, you can customize the UI to your needs. E.g. if we send the faucet to our test-users, we use the url https://spl-token-faucet.com?token-name=USDC to make the app look as it's a USDC faucet. If I want to mock the issuance of a TST token, I could send the url https://spl-token-faucet.com?token-name=TST.

# Program
## Running the program on Localnet

Swith to localnet.

```bash
solana config set --url http://127.0.0.1:8899
```

Run
```bash
rm -rf test-ledger && solana-test-validator
```
This will spin up a local validator that our client interacts with. More info on setting up  a local validator can be found [here](https://docs.solana.com/developing/test-validator).

## Anchor program building and deployment
Follow [this tutorial](https://dev.to/dabit3/the-complete-guide-to-full-stack-solana-development-with-react-anchor-rust-and-phantom-3291) for an in depth-explanation on how to build your anchor program and deploy it to the different clusters.


Copy the keypair into the build folder to override the generated keypair by Anchor. Normally, we never upload keypairs to GitHub, however we did upload this one so you can deploy the program locally using the same program id. You cannot upgrade the deployed versions (devnet, testnet) as their upgrade authority is already set.
```bash
cp spl_token_faucet-keypair.json ./target/deploy/spl_token_faucet-keypair.json
```

In order to build the program use following command.
```bash
anchor build
```

Now you can deploy it.
```bash
anchor deploy
```

You can now go to [the spl-token-faucet](https://spl-token-faucet.com/) and airdrop yourself some SOL and DUMMY tokens.

If you want to do an airdrop of 10000 DUMMY tokens without running the client to the current provider, run following script.
```shell
ANCHOR_WALLET=~/.config/solana/id.json ANCHOR_PROVIDER_URL=http://127.0.0.1:8899 node setup/usdc_airdrop.js
```

## Running program tests
Before it's possible to run tests, all packages need to be installed and `mocha-ts` and `typescript` need to be globally installed.
```bash
npm install -g ts-mocha typescript
```

```bash
npm install
```

Run all tests by using following command.
```bash
anchor test
```

# Client
## Running the client locally
Go to the `app` directory and run following command.
```bash
npm start
```

## Running client tests
Before it's possible to run tests, all packages need to be installed. Make sure you are in the `app` directory.
```bash
npm install
```

Now it's possible to run UI tests.
```bash
npm test
```
