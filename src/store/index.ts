// src/store.ts
import { create } from 'zustand';

interface StoreState {
	csrfToken?: string;
	setCSRFToken: (token: string) => void;
}

const useStore = create<StoreState>((set) => ({
	setCSRFToken: (token) => set(() => ({ csrfToken: token })),
}));

export default useStore;
