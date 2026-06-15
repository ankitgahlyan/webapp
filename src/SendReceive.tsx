import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { QrCode } from 'lucide-react'

import ton from './assets/ton.svg'
import { QrScanner } from './core/components/common/QrScanner'
// import Receive from './core/receive'
import { DropdownMenuComplex } from './components/SelectAction'
import { Props } from './types'

const SendReceive = observer(({ model }: Props) => {
    const [isScannerVisible, setIsScannerVisible] = useState(false);

    return (
        <>
            {/* <div className={model.isSendTabActive ? 'hidden' : ''}>
                <Receive model={model} />
            </div> */}
            <div className={'mx-auto w-full max-w-(--breakpoint-lg) font-body text-brown dark:text-dark-50' + (model.isSendTabActive ? '' : 'hidden')}>
                <p className='pt-4 text-center text-3xl font-bold'>Foss-Fiat</p>
                <p className='my-8 text-center'>
                    free and open source alternative to all Fiat Currencies
                </p>

                {/* <div className='dark:bg-tabbar mx-auto my-8 w-max rounded-full bg-milky p-0.5 dark:bg-dark-400 dark:text-white'>
                    <ul
                        className={
                            'tab-bar relative flex select-none flex-nowrap home'
                        }
                    >
                        <li
                            className='z-1 m-1 inline-block w-36 cursor-pointer rounded-full py-1 text-center'
                            onClick={() => {
                                model.setActiveTab('send')
                            }}
                        >
                            Send
                        </li>
                        <li
                            className='z-1 m-1 inline-block w-36 cursor-pointer rounded-full py-1 text-center'
                            onClick={() => {
                                model.setActiveTab('receive')
                            }}
                        >
                            Receive
                        </li>
                    </ul>
                </div> */}

                <div className='mx-auto mb-12 max-w-lg'>
                    <div
                        className={
                            'overflow-hidden transition-all duration-700 motion-reduce:transition-none' +
                            (model.isWalletConnected ? ' max-h-80' : ' max-h-0')
                        }
                    >
                        <div className='mx-4 rounded-t-2xl bg-brown px-8 pb-12 pt-4 text-sm text-white dark:bg-dark-600 dark:text-dark-50'>
                            <div className='flex flex-row flex-wrap'>
                                <p className='font-light'>GRAMS Amount</p>
                                <p className='ml-auto font-medium'>{model.tonBalanceFormatted}</p>
                            </div>

                            <div className='my-4 h-px bg-white opacity-40'></div>

                            <div className='flex flex-row flex-wrap'>
                                <p className='font-light'>HD Token Amount</p>
                                <p className='ml-auto font-medium'>{model.mintBalanceFormatted}</p>
                            </div>
                        </div>
                    </div>

                    <div className='mx-4 -mt-8 rounded-2xl bg-white p-8 shadow-xs dark:bg-dark-700'>
                        <button
                            id='submit'
                            className='h-14 w-full m-2 rounded-2xl bg-c6 text-lg font-medium text-white disabled:opacity-50 dark:text-dark-600'
                            disabled={!model.isWalletConnected}
                            onClick={(e) => {
                                model.receiver = model.address!.toString({ testOnly: true, bounceable: false })
                                model.setAmount('0.101')
                                model.sendTxn('claim')
                                const target = e.target as HTMLInputElement
                                target.blur()
                            }}
                        >
                            claim weekly airdrop
                        </button>

                        <p>choose ur action:</p>

                        <DropdownMenuComplex model={model} />
                        {/* <ActionRadioGroup model={model} /> */}

                        {/* receiver input section */}
                        <div
                            className={
                                'mb-8 mt-4 flex flex-row flex-wrap items-center rounded-lg border border-milky p-4 focus-within:border-brown dark:border-dark-900 dark:bg-dark-900 ' +
                                (model.isAddressValid
                                    ? 'text-green-500 border-green-500 focus-within:border-green-500 dark:text-green-500 dark:border-green-500 dark:focus-within:border-green-500'
                                    : 'text-orange border-orange focus-within:border-orange dark:text-orange dark:border-orange dark:focus-within:border-orange')
                            }
                        >
                            <input
                                id="receiver"
                                type="text"
                                inputMode="text"
                                placeholder="0Q... receiver address"
                                className={
                                    'h-full w-full flex-1 px-3 text-lg focus:outline-hidden dark:bg-dark-900 dark:text-dark-50'
                                }
                                value={model.receiver}
                                onChange={(e) => model.setReceiver(e.target.value)}
                            />

                            <button
                                type="button"
                                className={
                                    'rounded-lg bg-milky px-3 text-xs hover:bg-green-500 focus:outline-hidden active:bg-gray-300 dark:text-dark-600'
                                }
                                onClick={model.setReceiverToSelf}
                            >
                                self
                            </button>
                            <button type="button" onClick={() => setIsScannerVisible(true)} className={'p-1'}>
                                <QrCode />
                            </button>
                            <QrScanner
                                isVisible={isScannerVisible}
                                onClose={() => setIsScannerVisible(false)}
                                onScan={(data: string) => {
                                    if (!data) return;
                                    model.setReceiver(data.trim());
                                    setIsScannerVisible(false);
                                }}
                            />
                        </div>

                        {/* amount input section */}
                        <div
                            className={
                                'mb-8 mt-4 flex flex-row flex-wrap items-center rounded-lg border border-milky p-4 focus-within:border-brown dark:border-dark-900 dark:bg-dark-900 ' +
                                (model.isAmountValid
                                    ? 'border-green-500 text-green-500 focus-within:border-green-500 dark:border-green-500 dark:text-green-500 dark:focus-within:border-green-500'
                                    : ' border-orange text-orange focus-within:border-orange dark:border-orange dark:text-orange dark:focus-within:border-orange') + (model.activeAction === 'invite'
                                        ? 'hidden'
                                        : '')
                            }
                        >
                            <img src={ton} className={'w-7' + (model.isSendTabActive ? '' : ' hidden')} />
                            <label htmlFor="amount" className="sr-only">
                                votes count
                            </label>
                            <input
                                id="amount"
                                type="number"
                                inputMode="decimal"
                                step={100}
                                placeholder="amount to transfer"
                                className={
                                    'h-full w-full flex-1 px-3 text-lg focus:outline-hidden dark:bg-dark-900 dark:text-dark-50' +
                                    (model.isAmountValid ? '' : ' text-c6 dark:text-c6')
                                }
                                value={model.amount}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/,/g, '.')
                                    model.setAmount(value)
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && model.isButtonEnabled) {
                                        const button = document.querySelector<HTMLInputElement>('#submit')
                                        if (button != null) {
                                            button.click()
                                            const target = e.target as HTMLInputElement
                                            target.blur()
                                        }
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className={
                                    'rounded-lg bg-milky px-3 text-xs hover:bg-gray-200 focus:outline-hidden active:bg-gray-300 dark:text-dark-600' +
                                    (model.isAmountValid
                                        ? ''
                                        : ' bg-c6 text-white hover:bg-brown! active:bg-dark-600! dark:hover:text-dark-50')
                                }
                                onClick={model.setAmountToMax}
                            >
                                Max
                            </button>
                        </div>

                        {/* comment section */}
                        {/* <div
                            className={
                                'mb-8 mt-4 flex flex-row flex-wrap items-center rounded-lg border border-milky p-4 focus-within:border-brown dark:border-dark-900 dark:bg-dark-900 ' +
                                (model.isAmountValid
                                    ? ''
                                    : ' border-c6 focus-within:border-c6 dark:border-c6 dark:focus-within:border-c6')
                            }
                        >
                            <label htmlFor="comment" className="sr-only">
                                comments
                            </label>
                            <input
                                id="comment"
                                type="text"
                                inputMode="text"
                                placeholder="e.g: for coffee"
                                className={
                                    'h-full w-full flex-1 px-3 text-lg focus:outline-hidden dark:bg-dark-900 dark:text-dark-50'
                                }
                                value={model.comment}
                                onChange={(e) => {
                                    model.setComment(e.target.value)
                                }}
                            />
                            <label htmlFor="gas" className="sr-only">
                                gas/fees
                            </label>
                            <input
                                id="gas"
                                type="number"
                                inputMode="decimal"
                                min={"0.55"}
                                step={0.1}
                                placeholder="gas/fees: min 0.55"
                                className={
                                    'h-full w-full flex-1 px-3 text-lg focus:outline-hidden dark:bg-dark-900 dark:text-dark-50'
                                }
                                value={model.gas}
                                onChange={(e) => {
                                    model.setGas(e.target.value)
                                }}
                            />
                        </div> */}

                        <button
                            id='submit'
                            className='h-14 w-full rounded-2xl bg-c6 text-lg font-medium text-white disabled:opacity-50 dark:text-dark-600'
                            disabled={!model.isButtonEnabled}
                            onClick={(e) => {
                                if (model.isWalletConnected) {
                                    model.sendTxn()
                                } else {
                                    model.connect()
                                }
                                const target = e.target as HTMLInputElement
                                target.blur()
                            }}
                        >
                            {model.buttonLabel}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
})

export default SendReceive
