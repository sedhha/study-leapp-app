import { useState, useRef, useEffect } from 'react';
import classes from './CaptureImage.module.css';
import { TbCapture } from 'react-icons/tb';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import { MdOutlineFlipCameraIos } from 'react-icons/md';
import { NormalImage } from '@@/components/NormalImage';

interface ImageContainerProps {
	onCloseModal?: () => void;
	onChangeImage?: (b64Img?: string) => void;
}

const getCameraPermissionState = async () => {
	if (navigator.permissions) {
		return (
			navigator.permissions
				//@ts-ignore

				.query({ name: 'camera' })
				.then((permissionStatus) => permissionStatus.state)
		);
	}
	return '';
};

const stopStreaming = (stream: MediaStream) => {
	const tracks = stream.getTracks();
	// Stop each track
	tracks.forEach((track) => {
		track.stop();
	});
};

const requestCameraAccess = async (): Promise<boolean> => {
	// Check if the browser supports the necessary APIs
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		// Request camera access
		return navigator.mediaDevices
			.getUserMedia({ video: true })
			.then((stream) => {
				stopStreaming(stream);
				// Use the camera stream here if needed
				return true;
			})
			.catch((error) => {
				console.error('Error accessing camera:', error);
				return false;
			});
	} else {
		console.error('getUserMedia API is not supported in this browser');
		return false;
	}
};

const getAllCameraDeviceIds = async (): Promise<string[]> => {
	// Check if the browser supports the necessary APIs
	if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
		// Enumerate devices
		return navigator.mediaDevices
			.enumerateDevices()
			.then((devices) => {
				// Filter camera devices
				const cameraDevices = devices.filter(
					(device) => device.kind === 'videoinput'
				);

				// Log the camera devices
				return cameraDevices.map((device) => device.deviceId);
			})
			.catch((error) => {
				console.error('Error enumerating devices:', error);
				return [];
			});
	} else {
		console.error('enumerateDevices API is not supported in this browser');
		return [];
	}
};

const startStreamingByDeviceId = async (
	deviceId: string
): Promise<MediaStream | void> => {
	// Check if the browser supports the necessary APIs
	if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		// Request camera access
		return navigator.mediaDevices
			.getUserMedia({ video: { deviceId } })
			.then((stream) => {
				return stream;
			})
			.catch((error) => {
				console.error('Error accessing camera:', error);
				return;
			});
	} else {
		console.error('getUserMedia API is not supported in this browser');
		return;
	}
};

const CaptureImageContainer = ({
	onCloseModal,
	onChangeImage,
}: ImageContainerProps) => {
	const [imageData, setImageData] = useState<string | null>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [cameraState, setCameraState] = useState<
		'granted' | 'prompt' | 'denied' | ''
	>('');
	const [cameraOn, setCameraOn] = useState(false);
	const [supportedDevices, setSupportedDevices] = useState<string[]>([]);
	const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
	const videoRef = useRef(null);
	const canvasRef = useRef(null);

	useEffect(() => {
		// Check if Camera Permission Exists
		getCameraPermissionState().then((state) => setCameraState(state));
	}, []);

	useEffect(() => {
		// Get All Camera Devices supported

		getAllCameraDeviceIds().then((deviceIds) => {
			setSupportedDevices([...deviceIds]);
			if (deviceIds.length) setSelectedCamera(deviceIds[0]);
		});
	}, [cameraState]);

	const requestAndUpdateAccess = async () => {
		requestCameraAccess().then((allowed) =>
			allowed
				? getCameraPermissionState().then((state) => setCameraState(state))
				: setCameraState('denied')
		);
	};

	const startCamera = () => {
		setCameraOn(true);
		if (selectedCamera) {
			startStreamingByDeviceId(selectedCamera).then((stream) => {
				if (stream) {
					setStream(stream);
					const { current } = videoRef;
					if (current) {
						(current as { srcObject: MediaStream }).srcObject = stream;
					}
				}
			});
		}
	};

	const stopCamera = () => {
		setCameraOn(false);
		if (stream) {
			stopStreaming(stream);
			setStream(null);
		}
	};

	const captureImage = () => {
		if (canvasRef.current && videoRef.current && stream) {
			// Draw the current frame from the video onto the canvas
			const canvas = canvasRef.current;
			//@ts-ignore
			const context = canvas.getContext('2d');
			//@ts-ignore
			context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
			// Capture the image data from the canvas
			//@ts-ignore
			const imageDataURL = canvas.toDataURL('image/png');
			onChangeImage?.(imageDataURL);
			setImageData(imageDataURL);
		}
	};

	const restartCamera = () => {
		stopCamera();
		startCamera();
	};

	const discardImage = () => {
		setImageData(null);
		onChangeImage?.();
		restartCamera();
	};

	const switchDevice = () => {
		if (selectedCamera && supportedDevices.length) {
			const currentIndex = supportedDevices.indexOf(selectedCamera);
			// 0, 1, 2, 3
			if (currentIndex + 1 >= supportedDevices.length)
				setSelectedCamera(supportedDevices[0]);
			else setSelectedCamera(supportedDevices[currentIndex + 1]);
			restartCamera();
		}
	};

	const closeScanner = () => {
		onCloseModal?.();
		stopCamera();
	};

	return (
		<div className={classes.ModalContainer}>
			<div className={classes.ImageContainer}>
				{cameraState === 'granted' ? (
					<>
						<div className={classes.CameraCanvas}>
							{imageData ? (
								<NormalImage
									className={classes.CapturedImage}
									src={imageData}
									alt='Captured'
								/>
							) : (
								<>
									<video
										ref={videoRef}
										className={classes.VideoContainer}
										autoPlay
										playsInline
									></video>
									<canvas
										ref={canvasRef}
										style={{ display: 'none' }}
									></canvas>
								</>
							)}
						</div>
						{cameraOn ? (
							<>
								{!imageData && (
									<div className={classes.Row}>
										<TbCapture
											className={classes.Shutter}
											onClick={captureImage}
										/>
										{supportedDevices.length > 1 && (
											<MdOutlineFlipCameraIos
												className={classes.Shutter}
												onClick={switchDevice}
											/>
										)}
										<button
											className='StandardButton'
											onClick={stopCamera}
										>
											Stop Camera
										</button>
									</div>
								)}
								{imageData && (
									<div className={classes.Row}>
										<AiOutlineCheck className={[classes.CheckIcon].join(' ')} />
										<AiOutlineClose
											className={[classes.CloseIcon].join(' ')}
											onClick={discardImage}
										/>
									</div>
								)}
							</>
						) : (
							<div className={classes.ButtonsCol}>
								<button
									onClick={startCamera}
									className={'StandardButton ' + classes.SizedButton}
								>
									Start Camera
								</button>
							</div>
						)}
					</>
				) : (
					<div className={classes.CameraPermission}>
						<h1 className={classes.PermissionText}>
							{cameraState === 'prompt' || cameraState === ''
								? 'Seems like we need permissions to access your camera. Please '
								: 'You have denied to access your camera. Please reset the permissions through browser settings and then '}
							<span
								className={classes.AllowButton}
								onClick={requestAndUpdateAccess}
							>
								allow{' '}
							</span>
							us to access your camera.
						</h1>
					</div>
				)}
				<br />
				{cameraState === 'granted' && !supportedDevices.length && (
					<p className={classes.Error}>
						No camera hardware detected in this device.
					</p>
				)}
				<button
					className={'StandardButton'}
					onClick={closeScanner}
				>
					Close Scanner
				</button>
			</div>
		</div>
	);
};
export { CaptureImageContainer };
