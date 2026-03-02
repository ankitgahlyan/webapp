import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

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
	hint = 'Point your camera at a TON Connect QR code',
}) => {
	const scanLockRef = useRef(false);
	// ref to hold scanner instance synchronously
	const qrScannerRef = useRef<Html5Qrcode>(undefined);
	const [qrScanner, setQRScanner] = useState<Html5Qrcode>();

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
			setQRScanner(qrScannerRef.current);
		}

		const cameras = await Html5Qrcode.getCameras();
		// await new Promise(resolve => setTimeout(resolve, 5000));

		try {
			await qrScannerRef.current.start(
				cameras[1]?.id ?? cameras[0]?.id,
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
		// if (qrScanner && isVisible) {
		try {
			// setShowQRScanner(false);
			await qrScanner!.stop();
			onClose();
		} catch (err: any) {
			console.error('Error stopping QR scanner:', err);
		}
		// }
	}

	return <>
		{/* <button
			// variant="ghost"
			// size="sm"
			onClick={initializeQRScanner}
			className="h-auto p-1"
			title="Scan QR code"
		> */}
		{/* scan */}
		{/* <QrCode/> */}
		{/* <QrCode className="h-4 w-4" /> */}
		{/* </button> */}

		{/* <!-- QR Scanner Overlay --> */}
		{/* {showQRScanner && */}
		{isVisible &&
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
				<div className="relative w-full max-w-sm">
					<div className="space-y-4">
						<button onClick={stopQRScanner}>
							xxx CLOSE xxx
						</button>
						<div id="qr" className="w-full rounded-lg"></div>
					</div>
				</div>
			</div>
		}

	</>
}
