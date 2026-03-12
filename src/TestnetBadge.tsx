import { observer } from 'mobx-react-lite'
import { Model } from './Model'

interface Props {
    model: Model
}

const TestnetBadge = observer(({ model }: Props) => {
    return (
        <>
            <p className={'ml-3 font-logo text-2xl text-c6'}>Fi</p>
            <div
                className={
                    'ml-2 h-fit rounded-full bg-c6 px-2 py-1 text-xs uppercase text-white dark:text-dark-600' +
                    (model.isMainnet ? ' hidden' : '')
                }
            >
                Testnet
            </div>
        </>
    )
})

export default TestnetBadge
