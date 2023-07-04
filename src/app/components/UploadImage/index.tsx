import { useState } from 'react';
import classes from './UploadImage.module.css';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { RxCross2 } from 'react-icons/rx';
interface ImageContainerProps {
	onChangeImage?: (b64Img?: string) => void;
}
const UploadImage = ({ onChangeImage }: ImageContainerProps) => {
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [imgUploaded, setImgUploaded] = useState<boolean>(false);
	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		const files = event.target.files;
		if (!files || files.length === 0) {
			// Handle when no file is selected
			return;
		}
		if (event.target.files && event.target.files.length) {
			const file = event.target.files[0];
			const reader = new FileReader();
			setErrorMsg('Please wait, while we load the file');

			// Check file type
			if (!file.type.startsWith('image/')) {
				setErrorMsg('Please select an image file.');
				return;
			}

			// Check file size
			const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
			if (file.size > maxSizeInBytes) {
				setErrorMsg('File size exceeds the limit (2MB).');
				return;
			}

			reader.onloadend = () => {
				if (reader.result) {
					const base64String = reader.result as string;
					setImgUploaded(true);
					onChangeImage?.(base64String);
					setErrorMsg(null);
				}
			};

			reader.readAsDataURL(file);
		}
	};
	const discardImage = () => {
		setImgUploaded(false);
		onChangeImage?.();
	};
	return (
		<>
			{errorMsg == null && (
				<div className={classes.Row}>
					<div className={classes.FileInputContainer}>
						<button className={classes.IconButton}>
							<AiOutlineCloudUpload />
							{imgUploaded ? 'Change File' : 'Upload File'}
						</button>
						<input
							type='file'
							accept='image/*'
							className={classes.CustomFileInput}
							onChange={handleFileUpload}
							onClick={(event) => event.stopPropagation()}
						/>
					</div>
					{imgUploaded && (
						<RxCross2
							className={classes.ErrorIcon}
							onClick={discardImage}
						/>
					)}
				</div>
			)}

			{errorMsg != null && <p className={classes.Error}>{errorMsg}</p>}
		</>
	);
};
export { UploadImage };
