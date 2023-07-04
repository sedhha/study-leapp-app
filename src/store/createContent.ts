// src/store.ts
import { create } from 'zustand';
import {
	contentCreatorABI as abi,
	contentCreatorAddress as address,
} from '@@/solidity/contractClient';

interface ContentCreationStore {
	address: string;
	abi: object;
}

const useCreateContent = create<ContentCreationStore>((set) => ({
	address,
	abi,
}));

export default useCreateContent;
