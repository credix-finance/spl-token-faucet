import { Connection } from '@solana/web3.js';
import {
  Program, Provider, utils, web3,
} from '@project-serum/anchor';
import { programID } from '../../config/config';

export function GetProvider(wallet, network) {
  const opts = {
    preflightCommitment: 'processed',
  };
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new Provider(
    connection, wallet, opts.preflightCommitment,
  );
  return [provider, connection];
}

