'use client';
import classes from './page.module.css';
import { CaptureImageContainer } from '@@/components/CaptureImage';
import { useEffect, useState } from 'react';
import { AiOutlineScan, AiFillFilePdf } from 'react-icons/ai';
import { UploadImage } from './components/UploadImage';
import { cacheFetch } from '@@/client/apiFetch';
import apiRoutes from '@@/constants/api-routes.json';
import useWeb3Store from '@@/store/web3Walltet';
import { NormalImage } from './components/NormalImage';
import axios from 'axios';
import useContent from '@@/store/content';
import { useRouter } from 'next/navigation';
const interestOptions = [
	{ label: 'Art', value: 'Art' },
	{ label: 'Cooking', value: 'Cooking' },
	{ label: 'Origami', value: 'Origami' },
	{ label: 'Sports', value: 'Sports' },
	{ label: 'Singing', value: 'Singing' },
];

const learningStypeOptions = [
	{ label: 'Gamification', value: 'Gamification' },
	{ label: 'Active Recall', value: 'Active Recall' },
	{ label: 'Survey', value: 'Survey' },
	{ label: 'Visual', value: 'Visual' },
	{ label: 'Auditory', value: 'Auditory' },
];

export default function Home() {
	const [openModal, setOpen] = useState(false);
	const [b64Image, setB64Image] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const onClose = () => setOpen(false);
	const onOpen = () => setOpen(true);
	const { account, name, imgUrl } = useWeb3Store();
	const { setContent } = useContent();
	const router = useRouter();

	useEffect(() => {
		cacheFetch(apiRoutes.GET_TOKEN, { noCache: true });
	}, []);
	const onChangeImage = (image?: string) => {
		if (image) {
			const splits = image.split(',');
			if (splits.length === 2) setB64Image(splits[1]);
		} else setB64Image(null);
	};
	const generateReady = !!b64Image && b64Image != undefined;

	const generateContent = async () => {
		if (!!b64Image) {
			setLoading(true);
			axios
				.post(`/api/generate-content`, b64Image, {
					headers: {
						'Content-Type': 'application/text',
					},
				})
				.then((response) => {
					console.log('Data = ', response.data);
					localStorage.setItem('response.data', JSON.stringify(response.data));
					setTimeout(() => router.push('/content'), 10);
				});
		}
	};
	return (
		<>
			<dialog
				className={classes.Modal}
				open={openModal}
			>
				<CaptureImageContainer
					onCloseModal={onClose}
					onChangeImage={onChangeImage}
				/>
			</dialog>
			<main className={classes.main}>
				<div className={classes.LogoContainer}>
					<h1>Study Leap</h1>
					<div className={classes.UserProfile}>
						<h2 className={classes.ProfileGreeting}>{`Hello, ${
							name ?? 'Guest'
						}`}</h2>
						<NormalImage
							src={
								imgUrl ??
								'https://www.gravatar.com/avatar/00000000000000000000000000000000'
							}
							className={classes.AvatarImage}
						/>
						<h3 className={classes.ProfileGreetingSmall}>{`Wallet: ${
							account ?? 'Unknown Address'
						}`}</h3>
					</div>
				</div>
				<div className={classes.Row}>
					<div className={classes.InternalRow}>
						<label className={classes.Label}>Interests </label>
						<select className={classes.Options}>
							{interestOptions.map((interest) => (
								<option key={interest.value}>{interest.label}</option>
							))}
						</select>
					</div>
					{!openModal && <UploadImage onChangeImage={onChangeImage} />}
				</div>
				<div className={classes.Row}>
					<div className={classes.InternalRow}>
						<label className={classes.Label}>Learning Style Options </label>
						<select className={classes.Options}>
							{learningStypeOptions.map((interest) => (
								<option key={interest.value}>{interest.label}</option>
							))}
						</select>
					</div>
					<button
						className={classes.IconButton}
						onClick={onOpen}
					>
						<AiOutlineScan />
						Scan Material
					</button>
				</div>
				{generateReady && (
					<div className={classes.Row}>
						<p className={classes.InfoText}>
							Your Image was uploaded successfully. You can generate content
							now.
						</p>
						{loading ? (
							<p>Please wait! Processing...</p>
						) : (
							<button
								className={'StandardButton ' + classes.SmallButton}
								onClick={generateContent}
							>
								Generate Content
							</button>
						)}
					</div>
				)}

				<div className={classes.MaterialSection}>
					<h2>Interest Materials</h2>
					<div className={classes.GridElement}>
						<div className={classes.Card}>
							<AiFillFilePdf className={classes.PDFIcon} />
							<button className={classes.Button}>Download</button>
						</div>
						<div className={classes.Card}>
							<AiFillFilePdf className={classes.PDFIcon} />
							<button className={classes.Button}>Download</button>
						</div>
						<div className={classes.Card}>
							<AiFillFilePdf className={classes.PDFIcon} />
							<button className={classes.Button}>Download</button>
						</div>
					</div>
				</div>
				<br />
				<br />
				<br />
				<div className={classes.MaterialSection}>
					<h2>Gamification</h2>
					<div className={classes.GridElement}>
						<div className={classes.Card}>
							<AiFillFilePdf className={classes.PDFIcon} />
							<button className={classes.Button}>Download</button>
						</div>
						<div className={classes.Card}>
							<AiFillFilePdf className={classes.PDFIcon} />
							<button className={classes.Button}>Download</button>
						</div>
						<div className={classes.Card}>
							<AiFillFilePdf className={classes.PDFIcon} />
							<button className={classes.Button}>Download</button>
						</div>
					</div>
				</div>
			</main>
		</>
	);
}
