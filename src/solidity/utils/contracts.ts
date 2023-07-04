'use client';
import { Contract, InterfaceAbi, ethers } from 'ethers';
import { ContractRunner } from 'ethers';
import {
	contentCreatorABI,
	creatorRegistryABI,
	contentCreatorAddress,
	creatorRegistryAddress,
} from './contractClient';
import { Web3Window } from './web3SignIn';

const getSmartContract = (
	address: string,
	abi: InterfaceAbi,
	provider: ContractRunner
): Contract => new ethers.Contract(address, abi, provider);

const getContracts = async (): Promise<{
	error: boolean;
	message?: string;
	data?: { creatorContract: Contract; registrationContract: Contract };
}> => {
	const { ethereum } = window as Web3Window;
	if (!ethereum)
		return {
			error: true,
			message: 'Please install metamask extension and try refreshing the page',
		};
	try {
		const provider = new ethers.BrowserProvider(ethereum);
		const signer = await provider.getSigner();
		const creatorContract = getSmartContract(
			contentCreatorAddress,
			contentCreatorABI,
			signer
		);
		const registrationContract = getSmartContract(
			creatorRegistryAddress,
			creatorRegistryABI,
			signer
		);

		return { error: false, data: { registrationContract, creatorContract } };
	} catch (err) {
		return { error: true, message: (err as { message: string }).message };
	}
};

export { getContracts };
