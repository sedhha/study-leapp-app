// src/store.ts
import { Contract } from 'ethers';
import { create } from 'zustand';

interface Web3WalletStore {
	account: string | null;
	name: string | null;
	imgUrl: string | null;
	setAccount: (acount: string) => void;
	creatorContract?: Contract;
	registrationContract?: Contract;
	setCreatorContract: (contract: Contract) => void;
	setRegistrationContract: (contract: Contract) => void;
	setNameAndImg: (name: string, img: string) => void;
}

const useWeb3Store = create<Web3WalletStore>((set) => ({
	account: null,
	name: null,
	imgUrl: null,
	setAccount: (account) => set(() => ({ account: account })),
	setCreatorContract: (contract) => set(() => ({ creatorContract: contract })),
	setRegistrationContract: (contract) =>
		set(() => ({ registrationContract: contract })),
	setNameAndImg: (name, img) => set(() => ({ name: name, imgUrl: img })),
}));

export default useWeb3Store;
