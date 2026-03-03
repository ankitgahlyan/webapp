import type { Cell } from '@ton/core'

export type Page = 'home' | 'transfer'

export interface HeaderProps {
  currentPage: Page
}

export type FormStatusType = '' | 'error' | 'success'

export interface FormStatus {
  type: FormStatusType
  message: string
}

export interface TransferFormValues {
  queryId: string
  jettonMasterAddress: string
  destinationAddress: string
  tonAmount: string
  jettonAmount: string
  responseDestination: string
  customPayloadEnabled: boolean
  customPayloadHex: string
  forwardTonAmount: string
  forwardPayloadType: ForwardPayloadType
  forwardPayloadValue: string
}

export type ForwardPayloadType = 'text-comment' | 'binary-comment' | 'custom'

export type JettonPresetId = 'usdt' | 'usde' | 'custom'

export interface JettonPreset {
  id: Exclude<JettonPresetId, 'custom'>
  label: string
  address: string
}

export interface TonConnectMessage {
  address: string
  amount: string
  payload?: string
}

export interface TonConnectTransaction {
  validUntil: number
  messages: TonConnectMessage[]
}

export interface TransactionPreview {
  jettonWalletAddress: string
  body: Cell
  transaction: TonConnectTransaction
}
