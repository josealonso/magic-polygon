import { Magic } from 'magic-sdk';
import Web3 from 'web3';

const APP_MAGIC_KEY =
  process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY !== undefined ? process.env.REACT_APP_MAGIC_PUBLISHABLE_KEY : '';
/**
 * Configure Polygon Connection
 */
const polygonNodeOptions = {
  rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
  chainId: 80001,
};

export const magicMatic = new Magic(
  APP_MAGIC_KEY,
  { network: polygonNodeOptions }
);
magicMatic.network = 'matic';

export const maticWeb3 = new Web3(magicMatic.rpcProvider);

/**
 * Configure localhost Connection
 */
const customNodeOptions = {
  rpcUrl: 'http://127.0.0.1:7545', // Your own node URL
  chainId: 1011, // Your own node's chainId    // TODO
};

// Setting network to localhost blockchain
export const magicLocal = new Magic(
  APP_MAGIC_KEY,
  { network: customNodeOptions }
);
magicLocal.network = 'localhost';
export const localWeb3 = new Web3(magicLocal.rpcProvider);

//////////////////////////////////////////////

/**
 * Configure Ropsten Connection
 */

// const ropstenNodeOptions = {
//   rpcUrl: process.env.REACT_APP_ROPSTEN_RPC,
//   chainId: 3,
// };

// export const magicEthereum = new Magic(
//   APP_MAGIC_KEY,
//   { network: ropstenNodeOptions }
// );
// magicEthereum.network = 'ethereum';

// export const ethWeb3 = new Web3(magicEthereum.rpcProvider);
