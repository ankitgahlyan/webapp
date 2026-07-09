import { Network } from '@orbs-network/ton-access'
import { TonConnectUI, THEME, CHAIN, SendTransactionRequest } from '@tonconnect/ui'
import { action, autorun, computed, makeObservable, observable, runInAction } from 'mobx'
import { Address, Cell, OpenedContract, TonClient, TonClient4, toNano } from '@ton/ton'
import { FI_ADDRESS } from '../phosphate/scripts/consts';
import { FiWalletStore, fossFiWallet } from '../wrappers-ts/FossFiWallet.gen';
import { FiStore, fossFi } from '../wrappers-ts/FossFi.gen';

type ActivePage = 'home' | 'history' | 'settings'

type ActiveTab = 'send' | 'receive'

type ActiveAction = 'invite' | 'vote'

type UnstakeOption = 'unstake' | 'swap'

type WaitForTransaction = 'no' | 'signed' | 'sent' | 'timeout' | 'done'

interface FragmentState {
    network?: Network
    activePage?: ActivePage
    activeTab?: ActiveTab
}

// const updateTimesDelay = 5 * 60 * 1000
const updateLastBlockDelay = 3000 * 1000
const retryDelay = 1000 * 1000
const waitForCompletionDelay = 3 * 1000
const txValidUntil = 5 * 60

const defaultNetwork: Network = 'testnet'
const defaultActivePage: ActivePage = 'home'
const defaultActiveTab: ActiveTab = 'send'

const tonConnectButtonRootId = 'ton-connect-button'

const errorMessageTonAccess = 'Unable to access blockchain'
const errorMessageNetworkMismatch = 'Your wallet must be on '

const cookieBannerClosed = 'banner.closed'

export class Model {
    // observed state
    network: Network = defaultNetwork
    otonClient?: TonClient
    tonClient?: TonClient4
    address?: Address
    tonBalance?: bigint
    walletAddress?: Address
    fi?: OpenedContract<fossFi>
    fiState?: FiStore
    fiJetton?: OpenedContract<fossFiWallet>
    fiJettonState?: FiWalletStore
    activePage: ActivePage = defaultActivePage
    activeTab: ActiveTab = defaultActiveTab
    activeAction: ActiveAction = 'invite'
    amount = ''
    receiver = ''
    comment = ''
    gas = '0.55'
    unstakeOption: UnstakeOption = 'unstake'
    waitForTransaction: WaitForTransaction = 'no'
    ongoingRequests = 0
    errorMessage = ''

    // unobserved state
    dark = false
    tonConnectUI?: TonConnectUI
    lastBlock = 0
    switchNetworkCounter = 0
    timeoutConnectTonAccess?: ReturnType<typeof setTimeout>
    timeoutReadTimes?: ReturnType<typeof setTimeout>
    timeoutReadLastBlock?: ReturnType<typeof setTimeout>
    timeoutSwitchNetwork?: ReturnType<typeof setTimeout>
    timeoutErrorMessage?: ReturnType<typeof setTimeout>

    isBannerClosed = true

    // readonly numberParser = new NumberParser(navigator.language)

    constructor() {
        makeObservable(this, {
            network: observable,
            tonClient: observable,
            address: observable,
            tonBalance: observable,
            walletAddress: observable,
            activeAction: observable,
            activePage: observable,
            activeTab: observable,
            amount: observable,
            receiver: observable,
            comment: observable,
            gas: observable,
            unstakeOption: observable,
            waitForTransaction: observable,
            ongoingRequests: observable,
            errorMessage: observable,
            isBannerClosed: observable,

            isWalletConnected: computed,
            isMainnet: computed,
            isSendTabActive: computed,
            tonBalanceFormatted: computed,
            maxAmount: computed,
            amountInNano: computed,
            isAmountValid: computed,
            isAddressValid: computed,
            isAmountPositive: computed,
            isButtonEnabled: computed,
            buttonLabel: computed,

            setNetwork: action,
            setTonClient: action,
            setAddress: action,
            setActiveAction: action,
            setActivePage: action,
            setActiveTab: action,
            setAmount: action,
            setReceiver: action,
            setComment: action,
            setGas: action,
            setReceiverToSelf: action,
            setAmountToMax: action,
            setWaitForTransaction: action,
            beginRequest: action,
            endRequest: action,
            setErrorMessage: action,
            closeBanner: action,
        })
    }

    init() {
        this.dark =
            localStorage.theme === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)

        document.onvisibilitychange = this.controlBackgroundJobs
        this.controlBackgroundJobs()

        window.onhashchange = () => {
            const fragmentState = this.readFragmentState()
            runInAction(() => {
                this.setActivePage(fragmentState.activePage ?? defaultActivePage)
                this.setActiveTab(fragmentState.activeTab ?? defaultActiveTab)
                this.setNetwork(fragmentState.network ?? defaultNetwork)
            })
            this.writeFragmentState()
        }
        window.dispatchEvent(new HashChangeEvent('hashchange'))

        // const value = getCookie(cookieBannerClosed)
        this.isBannerClosed = !this.isWalletConnected
        // this.isBannerClosed = value === 'closed'

        this.initTonConnect()

        autorun(() => {
            this.connectTonAccess()
        })

        autorun(() => {
            void this.readLastBlockState()
        })

        autorun(() => {
            this.writeFragmentState()
        })
    }

    get isWalletConnected() {
        return this.address != null
    }

    get isMainnet() {
        return this.network === 'mainnet'
    }

    get isSendTabActive() {
        return this.activeTab === 'send'
    }

    get tonBalanceFormatted() {
        if (this.tonBalance != null) {
            return formatNano(this.tonBalance) + ' GRAMS'
        }
    }

    get mintBalance() {
        return this.fiJettonState?.jettonBalance ?? 0n
    }

    get mintBalanceFormatted() {
        if (this.mintBalance != null) {
            return formatNano(this.fiJettonState?.jettonBalance ?? 0n) + ' HD'
        }
    }

    get maxAmount() {
        return this.fiJettonState?.jettonBalance ?? 0n
    }

    get availableVotes() {
        return this.fiJettonState?.votes ?? 0n
    }

    get receivedVotes() {
        return this.fiJettonState?.receivedVotes ?? 0n
    }

    get amountInNano() {
        const amount = this.amount.trim()
        try {
            return toNano(amount)
        } catch {
            return undefined
        }
    }

    get isAmountValid() {
        const nano = this.amountInNano
        return nano != null && nano >= 0n && (this.tonBalance == null || nano <= this.maxAmount!)
    }

    get isAddressValid() {
        const receiver = this.receiver.trim()
        if (receiver === '') {
            return false
        }
        try {
            Address.parse(receiver)
            // todo: fixme: fetch contract active state for other than invite
            return true
        } catch {
            return false
        }
    }

    get isAmountPositive() {
        const nano = this.amountInNano
        return nano != null && nano > 0n
    }

    get isButtonEnabled() {
        const isAmountValid = this.isAmountValid
        const isAddressValid = this.isAddressValid
        const isAmountPositive = this.isAmountPositive
        const tonBalance = this.tonBalance
        const mintBalance = this.fiJettonState?.jettonBalance
        const haveBalance = tonBalance != null && mintBalance != null
        if (this.isWalletConnected) {
            return isAddressValid // todo: 
            // return (isAmountValid && isAmountPositive && haveBalance && isAddressValid) || (isAddressValid)
        } else {
            return true
        }
    }

    get buttonLabel() {
        if (this.isWalletConnected) {
            return this.activeAction
        } else {
            return 'Connect Wallet'
        }
    }

    setNetwork = (network: Network) => {
        if (this.network !== network) {
            this.network = network
            this.tonClient = undefined
            this.otonClient = undefined
            this.setAddress(undefined)
            this.tonBalance = undefined
            this.walletAddress = undefined
            this.amount = ''
            this.receiver = ''
            this.comment = ''
            this.gas = '0.55'
            this.errorMessage = ''
            clearTimeout(this.timeoutConnectTonAccess)
            clearTimeout(this.timeoutReadTimes)
            clearTimeout(this.timeoutReadLastBlock)
            clearTimeout(this.timeoutErrorMessage)
            if (this.tonConnectUI?.connected === true) {
                void this.tonConnectUI.disconnect()
            }
        }
    }

    setTonClient = (endpoint: string) => {
        this.tonClient = new TonClient4({ endpoint, timeout: 5 * 1_000 })
    }

    setoTonClient = (endpoint: string) => {
        this.otonClient = new TonClient({ endpoint, timeout: 5 * 1_000 })
    }

    setAddress = (address?: Address) => {
        this.address = address
        this.tonBalance = undefined
        this.walletAddress = undefined
        this.lastBlock = 0
    }

    setActivePage = (activePage: ActivePage) => {
        if (this.activePage !== activePage) {
            this.activePage = activePage
            this.controlBackgroundJobs()
            window.scrollTo(0, 0)
        }
    }

    setActiveTab = (activeTab: ActiveTab) => {
        if (this.activeTab !== activeTab) {
            this.activeTab = activeTab
            this.amount = ''
            this.receiver = ''
            this.comment = ''
            this.gas = '0.55'
        }
    }

    setActiveAction = (activeAction: ActiveAction) => {
        if (this.activeAction !== activeAction) {
            this.activeAction = activeAction
        }
    }

    setAmount = (amount: string) => {
        this.amount = amount
    }

    setAmountToMax = () => {
        this.amount = this.availableVotes.toString()
    }

    setReceiver = (receiver: string) => {
        this.receiver = receiver
    }

    setReceiverToSelf = () => {
        this.receiver = this.address?.toString({ testOnly: true, bounceable: false }) ?? ''
    }

    setComment = (comment: string) => {
        this.comment = comment
    }

    setGas = (gas: string) => {
        this.gas = gas
    }

    setWaitForTransaction = (wait: WaitForTransaction) => {
        this.waitForTransaction = wait
    }

    beginRequest = () => {
        this.ongoingRequests += 1
    }

    endRequest = () => {
        this.ongoingRequests -= 1
    }

    setErrorMessage = (errorMessage: string, delay: number) => {
        this.errorMessage = errorMessage
        clearTimeout(this.timeoutErrorMessage)
        if (errorMessage !== '') {
            this.timeoutErrorMessage = setTimeout(() => {
                this.setErrorMessage('', 0)
            }, delay)
        }
    }

    connectTonAccess = () => {
        // const network = this.network
        // clearTimeout(this.timeoutConnectTonAccess)
        // TonAccess is not working anymore
        // getHttpV4Endpoint({ network })
        //     .then(this.setTonClient)
        //     .catch((e) => {
        //         console.error(e)
        //         this.setErrorMessage(errorMessageTonAccess, retryDelay - 500)
        //         this.timeoutConnectTonAccess = setTimeout(this.connectTonAccess, retryDelay)
        //     })

        // Switch to fixed endpoint
        // if (network === 'mainnet') {
        // this.setTonClient('https://testnet.toncenter.com')
        // this.setTonClient('https://' + this.network + '-v4.tonhubapi.com')
        this.setoTonClient('https://' + this.network + '-v4.tonhubapi.com')
        // } else {
        this.setTonClient('https://testnet-v4.tonhubapi.com')
        // }
    }

    readLastBlockState = async () => {
        const tonClient = this.tonClient
        const address = this.address
        const fiAddress = Address.parse(FI_ADDRESS)
        clearTimeout(this.timeoutReadLastBlock)
        if (document.hidden) {
            return
        }
        this.timeoutReadLastBlock = setTimeout(() => void this.readLastBlockState(), updateLastBlockDelay)

        if (tonClient == null || fiAddress == null) {
            runInAction(() => {
                this.tonBalance = undefined
                this.fi = undefined
                this.fiState = undefined
                this.walletAddress = undefined
                this.fiJetton = undefined
                this.fiJettonState = undefined
            })
            return
        }

        try {
            this.beginRequest()
            const lastBlock = (await retry(() => tonClient.getLastBlock())).last.seqno
            if (lastBlock < this.lastBlock) {
                throw new Error('older block')
            }
            const fi = tonClient.openAt(lastBlock, fossFi.fromAddress(fiAddress))

            // const readFiState = retry(fi.getJettonData)

            const readTonBalance =
                address == null
                    ? Promise.resolve(undefined)
                    : retry(() => tonClient.getAccountLite(lastBlock, address)).then((value) =>
                        BigInt(value.account.balance.coins),
                    )

            const readFiJetton: Promise<[Address, OpenedContract<fossFiWallet>, typeof this.fiJettonState] | undefined> =
                address == null
                    ? Promise.resolve(undefined)
                    : (this.walletAddress != null
                        ? Promise.resolve(this.walletAddress)
                        :
                        // get from local storage
                        localStorage.getItem('fiWalletAddress_' + FI_ADDRESS + address.toString()) != null
                            ? Promise.resolve(Address.parse(localStorage.getItem('fiWalletAddress_' + FI_ADDRESS + address.toString())!))
                            :
                            retry(() =>
                                tonClient
                                    .openAt(lastBlock, fossFi.fromAddress(fiAddress))
                                    .getWalletAddress(address),
                            )
                    ).then(async (walletAddress) => {
                        // store to localstorage to avoid multiple calls to getWalletAddress for the same address
                        localStorage.setItem('fiWalletAddress_' + FI_ADDRESS + address.toString(), walletAddress.toString());
                        const fiJetton = tonClient.openAt(lastBlock, fossFiWallet.fromAddress(walletAddress))
                        const fiJettonState = await fiJetton.getWalletDataAll().catch((e: unknown) => {
                            if (e instanceof Error && 'message' in e && e.message === 'Exit code: -256') {
                                return undefined // wallet does not exists
                            } else {
                                throw e
                            }
                        })
                        return [walletAddress, fiJetton, fiJettonState]
                    })

            const parallel: [
                Promise<bigint | undefined>,
                Promise<[Address, OpenedContract<fossFiWallet>, typeof this.fiJettonState] | undefined>,
            ] = [readTonBalance, readFiJetton]
            const [tonBalance, fiJettonState] = await Promise.all(parallel)
            let [walletAddress, fiJetton, fiWalletState] = fiJettonState ?? []

            runInAction(() => {
                this.tonBalance = tonBalance
                this.fi = fi
                this.walletAddress = walletAddress
                this.fiJetton = fiJetton
                this.fiJettonState = fiWalletState
                this.lastBlock = lastBlock
            })

        } catch {
            this.setErrorMessage(errorMessageTonAccess, retryDelay - 500)
            clearTimeout(this.timeoutReadLastBlock)
            this.timeoutReadLastBlock = setTimeout(() => void this.readLastBlockState(), retryDelay)
        } finally {
            this.endRequest()
        }
    }

    pause = () => {
        clearTimeout(this.timeoutReadTimes)
        clearTimeout(this.timeoutReadLastBlock)
    }

    resume = () => {
        void this.readLastBlockState()
    }

    controlBackgroundJobs = () => {
        if (!document.hidden && this.activePage === 'home') {
            this.resume()
        } else {
            this.pause()
        }
    }

    makeTransaction(body: Cell): SendTransactionRequest {
        return {
            validUntil: Math.floor(Date.now() / 1000) + txValidUntil,
            network: CHAIN.TESTNET,
            from: this.address!.toRawString(), // todo: nullCheck
            messages: [
                {
                    address: this.fiJetton!.address.toString(), // todo:
                    amount: toNano(this.gas).toString(),
                    payload: body.toBoc().toString('base64'),
                },
            ],
        }
    }

    sendTxn = async (action: string | undefined = undefined) => {
        if (
            (this.address != null &&
                this.isAmountValid &&
                this.isAddressValid &&
                this.isAmountPositive &&
                this.amountInNano != null &&
                this.fiJetton != null &&
                this.tonConnectUI != null &&
                this.tonBalance != null
                // && this.mintBalance != null
            )
            // || (action === 'claim')
        ) {
            var amount =
                this.activeAction === 'invite' ? toNano(0.1)
                    : this.activeAction === 'vote' ? toNano(0.11)
                        // : this.activeAction === 'claim' ? toNano(0.101)
                        : this.amountInNano
                ;

            if (action === 'claim') {
                amount = toNano(0.101)
            }


            const tx = this.makeTransaction(fossFiWallet.createCellOfOthersActions({
                queryId: generateRandomQueryId(),
                jettonAmount: amount,
                transferRecipient: Address.parse(this.receiver.trim()),
                sendExcessesTo: this.address,
                customPayload: null,
                forwardTonAmount: 1n,
                forwardPayload: this.comment,
            }));

            // const tx = this.makeTransaction(tb);
            void this.tonConnectUI
                .sendTransaction(tx)
                // .then(() => this.waitForCompletion(queryId))
                .then(() => {
                    this.setAmount('')
                    this.setReceiver('')
                    this.setComment('')
                })
        }
    }

    waitForCompletion = async (queryId: bigint) => {
        const tonClient = this.tonClient
        const address = this.address

        if (tonClient == null || address == null) {
            this.setWaitForTransaction('timeout')
            return
        }

        this.setWaitForTransaction('signed')

        try {
            clearTimeout(this.timeoutReadLastBlock)

            for (let i = 0; i < 10; i += 1) {
                await sleep(waitForCompletionDelay)

                const lastBlock = (await retry(() => tonClient.getLastBlock())).last.seqno
                const last = (await retry(() => tonClient.getAccountLite(lastBlock, address))).account.last
                if (last == null) {
                    continue
                }
                const txs = await retry(() =>
                    tonClient.getAccountTransactions(address, BigInt(last.lt), Buffer.from(last.hash, 'base64')),
                )

                for (const txBlock of txs) {
                    const tx = txBlock.tx
                    if (tx.description.type !== 'generic' || tx.inMessage == null) {
                        continue
                    }

                    const inPayload = tx.inMessage.body.beginParse()
                    if (tx.inMessage.info.type === 'internal' && inPayload.remainingBits >= 32 + 64) {
                        inPayload.skip(32)
                        if (inPayload.loadUintBig(64) === queryId) {
                            await this.readLastBlockState()
                            clearTimeout(this.timeoutReadLastBlock)
                            this.setWaitForTransaction('done')
                            return
                        }
                    }

                    const outMessage = tx.outMessages.get(0)
                    if (this.waitForTransaction === 'signed' && outMessage != null) {
                        const outPayload = outMessage.body.beginParse()
                        if (outPayload.remainingBits >= 32 + 64) {
                            outPayload.skip(32)
                            if (outPayload.loadUintBig(64) === queryId) {
                                this.setWaitForTransaction('sent')
                                break
                            }
                        }
                    }
                }
            }
        } catch {
            this.setWaitForTransaction('timeout')
        } finally {
            this.timeoutReadLastBlock = setTimeout(() => void this.readLastBlockState(), updateLastBlockDelay)
        }
    }

    initTonConnect = () => {
        if (document.getElementById(tonConnectButtonRootId) != null) {
            this.connectWallet()
        } else {
            setTimeout(this.initTonConnect, 10)
        }
    }

    connect = () => {
        if (this.tonConnectUI != null) {
            void this.tonConnectUI.openModal()
        }
    }

    connectWallet = () => {
        this.tonConnectUI = new TonConnectUI({
            analytics: {
                mode: 'off'
            },
            manifestUrl: 'https://fossfiat.netlify.app/tonconnect-manifest.json',
            buttonRootId: tonConnectButtonRootId,
            actionsConfiguration: {
                twaReturnUrl: 'https://t.me/fossfiBot',
            },
            uiPreferences: {
                theme: this.dark ? THEME.DARK : THEME.LIGHT,
                colorsSet: {
                    [THEME.LIGHT]: {
                        connectButton: {
                            background: '#ff7e73',
                            foreground: '#fff',
                        },
                        background: {
                            primary: '#efebe5',
                            secondary: '#fff',
                            qr: '#fff',
                            tint: '#fff',
                            segment: '#fff',
                        },
                        text: {
                            primary: '#776464',
                            secondary: '#776464',
                        },
                        icon: {
                            primary: '#776464',
                            secondary: '#776464',
                            tertiary: '#776464',
                            success: '#4bb543',
                            error: '#e00',
                        },
                        constant: {
                            black: '#776464',
                            white: '#fff',
                        },
                        accent: '#ff7e73',
                    },
                    [THEME.DARK]: {
                        connectButton: {
                            background: '#ff7e73',
                            foreground: '#483637',
                        },
                        background: {
                            primary: '#464343', // dialog/connected-button background
                            secondary: '#8b807f', // menu item hover background
                            qr: '#eaeaea',
                            tint: '#8b807f',
                            segment: '#464343',
                        },
                        text: {
                            primary: '#f2f2f2', // dialog/connected-button text
                            secondary: '#ffedef', // dialog subtitle
                        },
                        icon: {
                            primary: '#f2f2f2', // browser extension icon
                            secondary: '#ffedef', // dialog close
                            tertiary: '#f2f2f2', // loading indicator in connect button
                            success: '#4bb543', // success notification color
                            error: '#f00', // error notification color
                        },
                        constant: {
                            black: '#333131', // qrcode color
                            white: '#333131', // ton connect footer
                        },
                        accent: '#ff7e73', // orange
                    },
                },
            },
        })
        this.tonConnectUI.onStatusChange((wallet) => {
            if (wallet != null) {
                const chain = wallet.account.chain
                if (
                    (chain === CHAIN.MAINNET && this.network === 'mainnet') ||
                    (chain === CHAIN.TESTNET && this.network === 'testnet')
                ) {
                    this.setAddress(Address.parseRaw(wallet.account.address))
                } else {
                    void this.tonConnectUI?.disconnect()
                    runInAction(() => {
                        this.setAddress(undefined)
                        this.setErrorMessage(
                            errorMessageNetworkMismatch + (this.isMainnet ? 'MainNet' : 'TestNet'),
                            10000,
                        )
                    })
                }
            } else {
                this.setAddress(undefined)
            }
        })
    }

    setDark = (dark: boolean) => {
        this.dark = dark
        if (dark) {
            localStorage.theme = 'dark'
            document.documentElement.classList.add('dark')
        } else {
            localStorage.theme = 'light'
            document.documentElement.classList.remove('dark')
        }
        if (this.tonConnectUI != null) {
            this.tonConnectUI.uiOptions = {
                uiPreferences: {
                    theme: dark ? THEME.DARK : THEME.LIGHT,
                },
            }
        }
    }

    switchNetwork = () => {
        this.switchNetworkCounter += 1
        clearTimeout(this.timeoutSwitchNetwork)
        if (this.switchNetworkCounter >= 5) {
            this.switchNetworkCounter = 0
            if (confirm(`Switch network to ${this.isMainnet ? 'TestNet' : 'MainNet'}?`)) {
                this.setNetwork(this.isMainnet ? 'testnet' : 'mainnet')
                window.scrollTo(0, 0)
            }
        } else {
            this.timeoutSwitchNetwork = setTimeout(() => {
                this.switchNetworkCounter = 0
            }, 1000)
        }
    }

    readFragmentState = (): FragmentState => {
        const fragmentState: FragmentState = {}
        if (window.location.hash.startsWith('#')) {
            const fragment = window.location.hash.substring(1)
            const pairs = fragment.split('/')
            for (const pair of pairs) {
                const [key, value] = pair.split('=', 2)
                if (key === 'network') {
                    if (value === 'mainnet' || value === 'testnet') {
                        fragmentState.network = value
                    }
                }
                if (key === 'page') {
                    if (value === 'home' || value === 'history' || value === 'settings') {
                        fragmentState.activePage = value
                    }
                }
                if (key === 'tab') {
                    if (value === 'send' || value === 'receive') {
                        fragmentState.activeTab = value
                    }
                }
            }
        }
        return fragmentState
    }

    writeFragmentState = () => {
        let hash = ''
        if (this.network !== defaultNetwork) {
            hash += '/network=' + this.network
        }
        if (this.activePage !== defaultActivePage) {
            hash += '/page=' + this.activePage
        }
        if (this.activeTab !== defaultActiveTab) {
            hash += '/tab=' + this.activeTab
        }
        hash += '/'
        window.location.hash = hash
    }

    closeBanner() {
        this.isBannerClosed = true
        setCookie(cookieBannerClosed, 'closed', 24)
    }
}

// class NumberParser {
//     #group: RegExp
//     #decimal: RegExp
//     #numeral: RegExp
//     #index: (substring: string) => string
//     constructor(locale: string) {
//         const parts = new Intl.NumberFormat(locale).formatToParts(12345.6)
//         const numerals = [...new Intl.NumberFormat(locale, { useGrouping: false }).format(9876543210)].reverse()
//         const index = new Map(numerals.map((d, i) => [d, i]))
//         this.#group = new RegExp(`[${(parts.find((d) => d.type === 'group') ?? parts[0]).value}]`, 'g')
//         this.#decimal = new RegExp(`[${(parts.find((d) => d.type === 'decimal') ?? parts[0]).value}]`)
//         this.#numeral = new RegExp(`[${numerals.join('')}]`, 'g')
//         this.#index = (d) => (index.get(d) ?? '').toString()
//     }
//     parse(input: string) {
//         const result = input
//             .trim()
//             .replace(this.#group, '')
//             .replace(this.#decimal, '.')
//             .replace(this.#numeral, this.#index)
//         return result ? +result : NaN
//     }
// }

export function formatCompact1Fraction(n: number): string {
    return n.toLocaleString(undefined, { notation: 'compact', maximumFractionDigits: 1 })
}

function formatCompact2Fraction(n: number): string {
    return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

function formatNano(amount: bigint | number, maximumFractionDigits = 2): string {
    return (Number(amount) / 1000000000).toLocaleString(undefined, {
        maximumFractionDigits,
    })
}

function formatPercent(amount: number): string {
    return amount.toLocaleString(undefined, {
        style: 'percent',
        maximumFractionDigits: 2,
    })
}

function formatDate(date: Date): string {
    return date.toLocaleString(navigator.language, {
        weekday: 'short',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
    })
}

function formatUnstakeHours(time: bigint): string {
    time += 5n * 60n // add 5 minutes as a gap for better estimation
    const now = Math.floor(Date.now() / 1000)
    const diff = Number(time) - now
    const hours = Math.max(0, Math.ceil(diff / 3600))
    return hours.toString()
}

function generateRandomQueryId(): bigint {
    const randomArray = new BigUint64Array(1)
    crypto.getRandomValues(randomArray)
    return randomArray[0]
}

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms))
}

function setCookie(name: string, value: string, hours: number) {
    const d = new Date()
    d.setTime(d.getTime() + hours * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${d.toUTCString()}; path=/; SameSite=Lax; Secure`
}

function getCookie(name: string): string | null {
    const cookie = document.cookie
    const regexp = new RegExp('(^| )' + name + '=([^;]+)')
    const match = regexp.exec(cookie)

    return match ? match[2] : null
}

function retry<T>(fn: () => Promise<T>, retries = 1): Promise<T> {
    return new Promise(function (resolve, reject) {
        let err: Error | undefined
        const attempt = () => {
            if (retries < 10) {
                console.warn('retry', retries)
            }
            if (retries <= 0) {
                reject(err ?? new Error())
            } else {
                fn()
                    .then(resolve)
                    .catch((e: unknown) => {
                        retries -= 1
                        err = e as Error
                        setTimeout(attempt)
                    })
            }
        }
        attempt()
    })
}
