import { Html5Qrcode } from 'html5-qrcode';
// import button from '../ui/button/button.svelte';
import { QrCode, X } from 'lucide-static';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

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
	const [isReady, setIsReady] = useState(false);
	const scanLockRef = useRef(false);
	// const [value, setValue] = useState(props.receiver);
	const [showQRScanner, setShowQRScanner] = useState(false);

	let qrScanner: Html5Qrcode | null = null;
	// let qrScannerReady = $state(false);
	// let error = $state('');

	const resetScanner = useCallback(() => {
		scanLockRef.current = false;
		setIsReady(false);
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
		setIsReady(true);
		initializeQRScanner();
	}, [isVisible]);

	if (!isVisible) {
		return null;
	}

	async function initializeQRScanner() {
		// Show the scanner UI first to render the element
		setShowQRScanner(true);
		// Wait for DOM to update
		// await tick();

		const cameras = await Html5Qrcode.getCameras();
		if (!qrScanner) {
			qrScanner = new Html5Qrcode('qr-reader');
		}

		try {
			await qrScanner.start(
				cameras.length > 1 ? cameras[1].id : cameras[0].id,
				undefined,
				onScanSuccess,
				() => { } // onScanError: Silently ignore QR scanning errors (continuous scanning attempts)
			);
		} catch (err: any) {
			// error = 'Failed to initialize camera for QR scanning';
			console.error('QR Scanner initialization failed:', err);
			setShowQRScanner(false);
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
				onClose();
				setShowQRScanner(false);
				await qrScanner!.stop();
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
						<button onClick={stopQRScanner} className="h-auto p-1">
							{/* <X className="h-5 w-5" /> */}
							X
						</button>
						<div id="qr-reader" className="w-full rounded-lg"></div>
					</div>
				</div>
			</div>
		}

	</>
}
