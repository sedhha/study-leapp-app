type Web3Account = string;
type Ethereum = {
	request: ({ method }: { method: string }) => Promise<Web3Account[]>;
};
type Web3Window = Window & typeof globalThis & { ethereum: Ethereum };

//@ts-ignore
const isWalletAvailable = () => window.ethereum != null;

const loginWithWallet = async (): Promise<Web3Account | void> => {
	const { ethereum } = window as Web3Window;
	const walletAllowed = isWalletAvailable();
	if (!walletAllowed) {
		alert('Please install metamask extension to login to the web app!');
		return;
	}
	const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
	if (accounts.length) return accounts[0];
	else if (walletAllowed && !accounts.length)
		alert(
			'Metamask extension is allowed but you need to sign in and then reload window'
		);
	return;
};

export { loginWithWallet };
export type { Web3Window };