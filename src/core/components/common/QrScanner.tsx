import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Html5Qrcode, type CameraDevice } from 'html5-qrcode';

interface QrScannerProps {
	isVisible: boolean;
	onScan: (data: string) => void | Promise<void>;
	onClose: () => void;
	hint?: string;
}

export const QrScanner: FC<QrScannerProps> = ({
	isVisible,
	onScan,
	onClose,
	// hint = 'Point your camera at a TON Connect QR code',
}) => {
	const scanLockRef = useRef(false);
	// ref to hold scanner instance synchronously
	const qrScannerRef = useRef<Html5Qrcode>(undefined);
	// const [qrScanner, setQRScanner] = useState<Html5Qrcode>();
	const [cameras, setCameras] = useState<CameraDevice[]>([]);
	const [cameraIndex, setCameraIndex] = useState(0);

	const resetScanner = useCallback(() => {
		scanLockRef.current = false;
	}, []);

	useEffect(() => {
		if (!isVisible) {
			resetScanner();
		}
	}, [isVisible, resetScanner]);

	const handleBarCodeScanned = useCallback(
		({ data }: { data: string }) => {
			if (scanLockRef.current) return;

			scanLockRef.current = true;

			Promise.resolve(onScan(data)).catch(() => {
				scanLockRef.current = false;
			});
		},
		[onScan],
	);

	useEffect(() => {
		if (!isVisible) return;
		initializeQRScanner();
	}, [isVisible]);

	if (!isVisible) {
		return null;
	}

	async function initializeQRScanner() {
		if (!qrScannerRef.current) {
			qrScannerRef.current = new Html5Qrcode('qr');
			// setQRScanner(qrScannerRef.current);
		}

		const cams = await Html5Qrcode.getCameras();
		setCameras(cams);
		// await new Promise(resolve => setTimeout(resolve, 5000));

		// choose initial camera index (prefer rear/back)
		let idx = cams.findIndex(c => /back|rear|environment/i.test(c.label));
		if (idx === -1) idx = cams.length > 1 ? cams.length - 1 : 0;
		setCameraIndex(idx);

		try {
			// pick a rear-facing camera if available (labels often contain back/rear/environment)
			const preferredCam =
				cameras.find(c => /back|rear|environment/i.test(c.label)) ||
				(cameras.length > 1 ? cameras[cameras.length - 1] : cameras[0]);

			await qrScannerRef.current.start(
				preferredCam.id,
				// cameras[1]?.id ?? cameras[0]?.id,
				// (cameras[1]?.id ?? cameras[0]?.id) as string,
				undefined,
				onScanSuccess,
				() => {
					// onScanError: Silently ignore QR scanning errors (continuous scanning attempts)
				},
			);
		} catch (err: any) {
			console.error('QR Scanner initialization failed:', err);
		}
	}

	function onScanSuccess(qrCodeMessage: string) {
		let address = qrCodeMessage.trim();

		// Extract address from ton://transfer/ prefix if present
		const tonTransferMatch = address.match(/ton:\/\/transfer\/(.+)/);
		if (tonTransferMatch) {
			address = tonTransferMatch[1];
		}

		// Update the bound value
		handleBarCodeScanned({ data: address })
		stopQRScanner();
	}

	async function stopQRScanner() {
		try {
			await qrScannerRef.current?.stop();
			onClose();
		} catch (err: any) {
			console.error('Error stopping QR scanner:', err);
		}
	}

	async function flipCamera() {
		if (!qrScannerRef.current || cameras.length < 2) return;
		const next = (cameraIndex + 1) % cameras.length;
		setCameraIndex(next);
		try {
			await qrScannerRef.current.stop();
		} catch { }
		try {
			await qrScannerRef.current.start(
				cameras[next].id,
				undefined,
				onScanSuccess,
				() => { },
			);
		} catch (err: any) {
			console.error('Error switching camera', err);
		}
	}

	return <>
		{/* <!-- QR Scanner Overlay --> */}
		{isVisible &&
			<div
				className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
				onClick={(e) => {
					e.stopPropagation();
					// close when clicking outside inner container
					if (e.target === e.currentTarget) {
						stopQRScanner();
					}
				}}
			>
				<div
					className="relative w-full max-w-sm"
					onClick={(e) => {
						e.stopPropagation(); // prevent clicks inside from reaching page
					}}
				>
					<div className="space-y-4">
						<div className="flex justify-between">
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation();
									stopQRScanner();
								}}
								className="text-white"
							>
								Close
							</button>
							{cameras.length > 1 && (
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										flipCamera();
									}}
									className="text-white"
								>
									Flip
								</button>
							)}
						</div>
						<div id="qr" className="w-full rounded-lg"></div>
					</div>
				</div>
			</div>
		}

	</>
}
