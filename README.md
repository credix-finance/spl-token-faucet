# SPL token faucet
This project aims at implementing an SPL token faucet in its simplest form using Anchor. Faucets are a must-have when developing dApps to test out token flows. A faucet allows you to receive an arbitrary amount of tokens; always coming from the same Mint. At Credix, we use this faucet to "mimic" USDC on testnet and devnet (as the USDC faucet is only available on testnet AND only allows 5USDC per IP, which is very limiting). The program is deployed on both testnet and devnet at `4sN8PnN2ki2W4TFXAfzR645FWs8nimmsYeNtxM8RBK6A` and the Mints PK is `Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr` on both networks.

A reference UI has been implemented to make it easy for your end-users to get DUMMY tokens and use those in your application. The code for this reference UI can be found in the App folder. The hosted version can be found here:

## Running the app on Localnet
When using localnet, be sure to run
```sh
$ solana-test-validator
```
This will spin up a local validator that our client interacts with. More info on setting up  a local validator can be found [here](https://docs.solana.com/developing/test-validator).

## Anchor program building and deployment
Follow [this tutorial](https://dev.to/dabit3/the-complete-guide-to-full-stack-solana-development-with-react-anchor-rust-and-phantom-3291) for an in depth-explanation on how to build your anchor program and deploy it to the different clusters.


