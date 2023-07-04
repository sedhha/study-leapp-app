import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
	solidity: '0.8.18',
	networks: {
		hardhat: {
			chainId: 1337,
		},
	},
	paths: {
		artifacts: './artifacts',
	},
};

export default config;
