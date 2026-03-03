import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Model } from './../Model';
import { ArrowLeft, Copy, Check } from 'lucide-react';

interface ReceiveProps {
    model: Model;
}

const Receive = observer(({ model }: ReceiveProps) => {
    const [copied, setCopied] = useState(false);
    const userAddress = model.address?.toString() ?? '';

    const copyAddress = () => {
        if (!userAddress) return;
        navigator.clipboard.writeText(userAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const generateQR = (address: string): string =>
        `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
            address,
        )}`;

    return (
        <div className="container mx-auto max-w-lg px-4 py-8">
            <button
                className="text-white mb-4 inline-flex items-center text-sm text-blue-600 hover:underline"
                onClick={() => (model.setActiveTab('send'))}
            // onClick={() => (window.location.href = '/')}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </button>

            {userAddress && (
                <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-dark-700">
                    <div className="space-y-6">
                        {/* QR Code */}
                        <div className="flex flex-col items-center"
                        onClick={(e) => {
                            e.stopPropagation();
                            // close when clicking outside inner container
                            if (e.target === e.currentTarget) {
                                model.setActiveTab('send');
                            }
                        }}
                        >
                            <div className="border-border rounded-xl border-2 bg-white p-4">
                                <img
                                    src={generateQR(userAddress)}
                                    alt="QR Code"
                                    className="h-48 w-48"
                                />
                            </div>
                            <p className="text-muted-foreground mt-4 text-center text-sm">
                                gimme gimme some fundssshhh...
                            </p>
                        </div>

                        {/* Address */}
                        <div className="relative">
                            <div className="bg-muted rounded-lg border p-4 font-mono text-sm break-all">
                                {userAddress}
                            </div>
                        </div>

                        {/* Copy Button */}
                        <button
                            className={`w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600 focus:outline-none ${copied ? 'opacity-80' : ''}`}
                            onClick={copyAddress}
                        >
                            {copied ? (
                                <>
                                    <Check className="mr-2 h-4 w-4 inline-block" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="mr-2 h-4 w-4 inline-block" />
                                    Copy Address
                                </>
                            )}
                        </button>

                        {/* Warning */}
                        {/* <div className="flex gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
                            <AlertCircle className="h-5 w-5 shrink-0 text-yellow-600" />
                            <div>
                                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                    Important
                                </p>
                                <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                                    Only send TON blockchain assets to this address. Sending assets
                                    from other blockchains may result in permanent loss.
                                </p>
                            </div>
                        </div> */}
                    </div>
                </div>
            )}
        </div>
    );
});

export default Receive;
