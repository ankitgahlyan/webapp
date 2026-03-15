import { observer } from 'mobx-react-lite'
import { Model } from './Model'
// import gift from './assets/hpo-hton-ton-gift.webp'
// import ton from './assets/ton.svg'
// import hpo from './assets/hpo.svg'

interface Props {
    model: Model
}

const Referral = observer(({ model }: Props) => {
    return <div className='m-auto p-4 border-purple-500 bg-black text-white'>
        <div className='font-bold'>
            FAQ's
        </div>
        <div className='text-sm text-red-500'>Q. why do we exist?</div>
        <div className='text-sm text-green-500'>A. to fullfill THE PROMISE of BITCOIN.</div>
        Q. what's THE PROMISE? <br />
        A. to create a p2p cash. <br />
        Q. why we need a p2p cash? <br />
        A. for interest-free credit. <br />
        Q. 
        Q. why bitcoin failed? <br />
        A. coz it is just a digital version of already failed system (gold standard). <br />
        Q. why gold standard failed? <br />
        A. it introduced self-imposed constraints. <br />
        Q. why will we succeed? <br />
        A. coz it's a decentralised version of a successful system (fiat).

        <p>send any questions via <a href="https://t.me/keeperXBot">TELEGRAM</a></p>
    </div>
    // return (
    //     <div className='mx-auto w-full max-w-(--breakpoint-lg) p-4 pb-32 font-body text-brown dark:text-dark-50'>
    //         <p className='px-8 pt-4 text-center text-3xl font-bold'>Staking Rewards</p>
    //         <p className='mb-4 mt-2 px-8 text-center'>Track your hTON rewards.</p>

    //         {model.isWalletConnected || (
    //             <div className='mx-auto mt-4 max-w-md rounded-xl bg-white shadow-md dark:bg-dark-700'>
    //                 <div className='mx-auto flex max-w-sm flex-col gap-8 p-8'>
    //                     <p className='text-center'>
    //                         Connect your TON wallet to view your <b className='font-bold'>staking rewards</b>.
    //                     </p>
    //                     <img src={gift} className='h-36 object-contain' />
    //                     <button
    //                         className='mx-auto block h-14 w-full rounded-2xl bg-c6 text-lg font-medium text-white dark:text-dark-600 sm:w-80'
    //                         onClick={(e) => {
    //                             model.connect()
    //                             const target = e.target as HTMLInputElement
    //                             target.blur()
    //                         }}
    //                     >
    //                         {model.buttonLabel}
    //                     </button>
    //                 </div>
    //             </div>
    //         )}

    //         {model.isWalletConnected && (
    //             <>
    //                 <div className='mx-auto mb-4 flex max-w-md flex-col rounded-xl bg-white p-8 text-sm shadow-md dark:bg-dark-700'>
    //                     <h3 className='mb-2 font-bold'>Current Balance</h3>
    //                     <div className='flex flex-row gap-1'>
    //                         <p className=''>{model.tonBalanceFormatted}</p>
    //                         <p className='text-gray-400'>{model.htonBalanceInTon}</p>
    //                     </div>

    //                     <hr className='my-4' />

    //                     <h3 className='mb-2 font-bold'>Rewards After a Year</h3>
    //                     <div className='flex flex-row gap-1'>
    //                         <p className=''>{model.profitAfterOneYear}</p>
    //                     </div>

    //                     <hr className='my-4' />

    //                     <h3 className='mb-2 font-bold'>History Rate</h3>
    //                     <div className=''>
    //                         {model.walletRewards != null && (
    //                             <p className=''>
    //                                 {(model.walletRewards.rewardCoefficients ?? [1])[model.walletRewards.clubLevel] ??
    //                                     1}
    //                                 x (Level {model.walletRewards.clubLevel + 1}
    //                                 <span className='text-gray-400'>
    //                                     /{(model.walletRewards.rewardCoefficients ?? [1]).length}
    //                                 </span>
    //                                 )
    //                             </p>
    //                         )}
    //                     </div>
    //                     {(model.walletRewards?.clubLevel ?? 0) <
    //                         (model.walletRewards?.rewardCoefficients ?? [1]).length - 1 && (
    //                         <p className='text-gray-400'>
    //                             Level {(model.walletRewards?.rewardCoefficients ?? [1]).length} Rewards:{' '}
    //                             {model.profitAfterOneYearOnLastLevel}
    //                         </p>
    //                     )}

    //                     <a
    //                         className='mx-auto mt-8 block h-14 w-full cursor-pointer place-content-center rounded-2xl bg-c6 text-center text-lg font-medium text-white dark:text-dark-600 sm:w-80'
    //                         href='https://t.me/HipoFinanceBot/join'
    //                     >
    //                         {model.claimWalletRewardsLabel}
    //                     </a>
    //                 </div>

    //                 {model.walletRewards != null && (
    //                     <div className='mx-auto flex max-w-md flex-col rounded-xl bg-white px-8 shadow-md dark:bg-dark-700'>
    //                         <h3 className='mb-4 mt-8 font-bold'>Recent Rewards</h3>

    //                         {model.walletRewards.earnedRewards.map((history, i) => (
    //                             <div className='my-4 flex w-full flex-col gap-2 text-sm' key={i}>
    //                                 {i > 0 && <hr className='-mt-2 mb-2' />}

    //                                 <div className='flex flex-row'>
    //                                     <div
    //                                         className=''
    //                                         title={history.time.toLocaleString(navigator.language, {
    //                                             year: 'numeric',
    //                                             month: 'numeric',
    //                                             day: 'numeric',
    //                                             hour: '2-digit',
    //                                             minute: '2-digit',
    //                                             hour12: false,
    //                                         })}
    //                                     >
    //                                         {history.time.toLocaleString(navigator.language, {
    //                                             month: 'long',
    //                                             day: '2-digit',
    //                                         })}
    //                                     </div>
    //                                     <div className='ml-auto'>Rewards</div>
    //                                 </div>

    //                                 <div className='flex flex-row items-center'>
    //                                     <img src={ton} className='h-8 w-8' />
    //                                     <div className='ml-auto flex flex-row gap-1'>
    //                                         <span className='text-green-600'>{history.tonReward}</span>
    //                                         <span className='text-gray-400'>TON</span>
    //                                     </div>
    //                                 </div>

    //                                 <div className='flex flex-row items-center'>
    //                                     <img src={hpo} className='h-8 w-8' />
    //                                     <div className='ml-auto flex flex-row gap-1'>
    //                                         <span className='text-green-600'>{history.hpoReward}</span>
    //                                         <span className='text-gray-400'>HPO</span>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         ))}

    //                         <div className='mt-8 flex flex-col place-content-center items-center gap-1'>
    //                             {model.walletRewardsFetchState === 'error' && (
    //                                 <p className=''>Oops! Please try again a little later.</p>
    //                             )}
    //                         </div>

    //                         {model.walletRewards?.earnedRewards.length === 0 && model.tonBalance! > 0n && (
    //                             <div className='mx-auto flex max-w-md flex-col gap-8 p-8'>
    //                                 <p className='text-center'>
    //                                     Your first history will be credited within <b className='font-bold'>36 hours</b>.
    //                                 </p>
    //                                 <img src={gift} className='h-36 object-contain' />
    //                             </div>
    //                         )}

    //                         {model.walletRewards?.earnedRewards.length === 0 && model.tonBalance === 0n && (
    //                             <div className='mx-auto -mt-8 flex max-w-sm flex-col gap-8 p-8'>
    //                                 <p className='text-center'>Start staking with Hipo for daily rewards!</p>
    //                                 <img src={gift} className='h-36 object-contain' />
    //                                 <button
    //                                     className='mx-auto block h-14 w-full rounded-2xl bg-c6 text-lg font-medium text-white dark:text-dark-600 sm:w-80'
    //                                     onClick={() => {
    //                                         model.setActivePage('home')
    //                                         model.setActiveTab('send')
    //                                     }}
    //                                 >
    //                                     Home Now
    //                                 </button>
    //                             </div>
    //                         )}
    //                     </div>
    //                 )}
    //             </>
    //         )}
    //     </div>
    // )
})

export default Referral
