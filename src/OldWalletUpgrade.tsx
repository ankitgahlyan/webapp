import { observer } from 'mobx-react-lite'
import { Model } from './Model'

interface Props {
    model: Model
}

const OldWalletUpgrade = observer(({ model }: Props) => {
    return (
        <div
            className={
                'mx-auto flex w-full max-w-(--breakpoint-lg) flex-col items-center overflow-hidden font-body text-brown transition-all duration-700 motion-reduce:transition-none' +
                (model.oldWalletTokens != null && model.oldWalletTokens > 0n ? ' max-h-400' : ' max-h-0')
            }
        >
            <div className='bg-attention dark:bg-attentiondark m-4 flex max-w-2xl flex-col items-center rounded-2xl p-4 shadow-xs'>
                <h3 className='my-4 text-xl font-bold'>Upgrade to Hipo Version 2</h3>
                <p className='max-w-xl px-4 py-2'>
                    Press &quot;Upgrade&quot; below to switch automatically from the old to the new version.
                </p>
                <p className='max-w-xl px-4 py-2'>
                    You have <b>{model.oldWalletTokensFormatted}</b> in the old version. After the upgrade, you&apos;ll
                    get <b>{model.newWalletTokensFormatted}</b> in the new version.
                </p>
                <p className='max-w-xl px-4 py-2'>
                    After confirming, it may take a few minutes to receive the new hTON. Don&apos;t worry!
                </p>
                <button
                    className='my-4 rounded-2xl bg-c6 px-16 py-2 text-lg font-medium text-white dark:text-dark-600'
                    onClick={model.upgradeOldWallet}
                >
                    Upgrade
                </button>
            </div>
        </div>
    )
})

export default OldWalletUpgrade
