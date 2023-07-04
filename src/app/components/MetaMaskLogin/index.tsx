'use client';
import { loginWithWallet } from '@@/solidity/web3SignIn';
import useWeb3Store from '@@/store/web3Walltet';
import classes from './MetaMaskLogin.module.css';
import { useEffect, useState } from 'react';
import { getContracts } from '@@/solidity/contracts';
import { useRouter } from 'next/navigation';
import { NormalImage } from '@@/components/NormalImage';

const MetaMaskLogin = () => {
	const {
		setAccount,
		setNameAndImg,
		setCreatorContract,
		setRegistrationContract,
		registrationContract,
		account,
	} = useWeb3Store();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [firstTime, setFirstTime] = useState(false);
	const [uName, setUName] = useState('');
	const [imgUrl, setImgUrl] = useState(
		'https://www.gravatar.com/avatar/00000000000000000000000000000000'
	);

	const router = useRouter();

	const loginToMetaMask = async () => {
		setLoading(true);
		loginWithWallet()
			.then((account) => {
				if (account) {
					setAccount(account);
				} else
					setError(
						'Unexpected error occured while logging in. Please refresh the page and retry.'
					);
			})
			.catch((error) => {
				setError(`Error occured while logging in: ${error.message}`);
			})
			.finally(() => setLoading(false));
	};

	const getUserDetails = async () => {
		if (registrationContract)
			try {
				const newUserCount =
					(await registrationContract.getCreatorByAddress(account)) ??
					'Oops we lost';
				const [_, name, b64Image] = newUserCount;
				if (name === 'Not Found') setFirstTime(true);
				else {
					setFirstTime(false);
					setNameAndImg(name, b64Image);
					//TODO: Redirect to main page
					router.push('/');
				}
			} catch (err) {
				console.log('Error occured with smart contract = ', err);
			}
	};

	useEffect(() => {
		if (account) {
			setLoading(true);
			getContracts()
				.then(async ({ error, data, message }) => {
					if (!error && data) {
						const { creatorContract, registrationContract } = data;
						setCreatorContract(creatorContract);
						setRegistrationContract(registrationContract);
					} else
						setError(
							`Error occured while fetching smart contracts: ${
								message ?? 'Unknown error'
							}`
						);
				})
				.catch((error) => setError(error.message))
				.finally(() => setLoading(false));
		}
	}, [account, setCreatorContract, setRegistrationContract]);

	useEffect(() => {
		getUserDetails();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [registrationContract]);

	const registerUser = async () => {
		setLoading(true);
		if (registrationContract) {
			const user = await registrationContract.signup(account, uName, imgUrl);
			await user.wait();
			setFirstTime(false);
			//TODO: Redirect to main page
			setLoading(false);
			router.push('/');
		}
	};

	return (
		<div className={classes.container}>
			<NormalImage
				className={classes.metamaskLogo}
				src='/meta-mask.png'
			/>
			{loading ? (
				<p className={classes.SignInText}>Loading...</p>
			) : (
				<button
					className={'StandardButton'}
					onClick={loginToMetaMask}
				>
					Login to Metamask
				</button>
			)}
			{error != null && <p className={classes.ErrorText}>{error}</p>}
			{firstTime && (
				<>
					<input
						type='text'
						className={classes.Input}
						placeholder='Please Input your Name'
						value={uName}
						onChange={(e) => setUName(e.target.value)}
					/>
					<input
						type='url'
						className={classes.Input}
						placeholder='Please Input your Image Avatar URL'
						value={imgUrl}
						onChange={(e) => setImgUrl(e.target.value)}
					/>
					<button
						className='StandardButton'
						onClick={registerUser}
					>
						Complete Registration
					</button>
				</>
			)}
		</div>
	);
};

export default MetaMaskLogin;
