import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-network-helpers';
import '@typechain/hardhat';
import '@typechain/hardhat/dist/type-extensions';
import { HardhatUserConfig } from 'hardhat/config';
import 'tsconfig-paths/register';

const config: HardhatUserConfig = {
  paths: {
    sources: './test/contracts',
  },
  solidity: {
    version: '0.8.4',
    settings: {
      outputSelection: {
        '*': {
          '*': ['storageLayout'],
        },
      },
    },
  },
  typechain: {
    outDir: 'typechained',
    target: 'ethers-v6',
  },
};

export default config;
