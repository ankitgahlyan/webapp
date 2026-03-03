import { Buffer } from 'buffer'
import { Address, beginCell, type Cell, toNano } from '@ton/core'
import { TonClient, type TupleItemSlice } from '@ton/ton'
import type {
  ForwardPayloadType,
  JettonPreset,
  JettonPresetId,
  TransferFormValues,
  TransactionPreview,
  TonConnectTransaction,
} from '../types'

const TONCENTER_ENDPOINT =
  import.meta.env.VITE_TON_RPC_ENDPOINT ?? 'https://toncenter.com/api/v2/jsonRPC'

export const JETTON_PRESETS: JettonPreset[] = [
  {
    id: 'usdt',
    label: 'Tether USD',
    address: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs',
  },
  {
    id: 'usde',
    label: 'Ethena USDe',
    address: 'EQAIb6KmdfdDR7CN1GBqVJuP25iCnLKCvBlJ07Evuu2dzP5f',
  },
]

const client = new TonClient({
  endpoint: TONCENTER_ENDPOINT,
  apiKey: import.meta.env.VITE_TONCENTER_API_KEY,
})

export function getPresetIdByAddress(address: string): JettonPresetId {
  const preset = JETTON_PRESETS.find((item) => item.address === address)
  return preset ? preset.id : 'custom'
}

export function getJettonPresetAddress(presetId: JettonPresetId): string {
  return JETTON_PRESETS.find((item) => item.id === presetId)?.address ?? ''
}

function toBase64Cell(cell: Cell): string {
  return Buffer.from(cell.toBoc()).toString('base64')
}

function hexToBytes(hex: string, fieldName: string): Uint8Array | null {
  const normalized = hex.trim().replace(/^0x/i, '').replace(/\s+/g, '')

  if (normalized.length === 0) {
    return null
  }

  if (normalized.length % 2 !== 0) {
    throw new Error(`${fieldName} must contain an even number of characters.`)
  }

  if (!/^[\da-fA-F]+$/.test(normalized)) {
    throw new Error(`${fieldName} must contain only hexadecimal characters.`)
  }

  const bytes = new Uint8Array(normalized.length / 2)

  for (let index = 0; index < normalized.length; index += 2) {
    bytes[index / 2] = parseInt(normalized.slice(index, index + 2), 16)
  }

  return bytes
}

function parseTonAmount(value: string, fieldName: string): bigint {
  try {
    return toNano(value || '0')
  } catch {
    throw new Error(`${fieldName} must be a valid TON amount.`)
  }
}

function parseAddress(value: string, fieldName: string): Address {
  try {
    return Address.parse(value.trim())
  } catch {
    throw new Error(`${fieldName} is not a valid TON address.`)
  }
}

function parseJettonAmount(value: string): bigint {
  const normalized = value.trim()

  if (!/^\d+$/.test(normalized)) {
    throw new Error('Jetton amount must be provided in elementary units as a whole number.')
  }

  return BigInt(normalized)
}

function parseQueryId(value: string): bigint {
  const normalized = value.trim()

  if (!/^\d+$/.test(normalized)) {
    throw new Error('Query ID must be a whole number between 0 and 18446744073709551615.')
  }

  const queryId = BigInt(normalized)
  const maxUint64 = (1n << 64n) - 1n

  if (queryId < 0 || queryId > maxUint64) {
    throw new Error('Query ID must be a whole number between 0 and 18446744073709551615.')
  }

  return queryId
}

async function resolveJettonWalletAddress(masterAddress: Address, ownerAddress: Address): Promise<Address> {
  const ownerSlice = beginCell().storeAddress(ownerAddress).endCell()
  const tupleItem: TupleItemSlice = {
    type: 'slice',
    cell: ownerSlice,
  }
  const result = await client.runMethod(masterAddress, 'get_wallet_address', [tupleItem])

  return result.stack.readAddress()
}

function buildForwardPayloadCell(
  forwardPayloadType: ForwardPayloadType,
  forwardPayloadValue: string
): Cell | null {
  if (!forwardPayloadValue.trim()) {
    return null
  }

  if (forwardPayloadType === 'text-comment') {
    const commentBytes = new TextEncoder().encode(forwardPayloadValue)

    return beginCell()
      .storeUint(0, 32)
      .storeBuffer(Buffer.from(commentBytes))
      .endCell()
  }

  if (forwardPayloadType === 'binary-comment') {
    const payloadBytes = hexToBytes(forwardPayloadValue, 'Binary comment hex')

    if (!payloadBytes) {
      return null
    }

    return beginCell()
      .storeUint(0, 32)
      .storeUint(0xff, 8)
      .storeBuffer(Buffer.from(payloadBytes))
      .endCell()
  }

  const payloadBytes = hexToBytes(forwardPayloadValue, 'Custom payload hex')

  if (!payloadBytes) {
    return null
  }

  return beginCell().storeBuffer(Buffer.from(payloadBytes)).endCell()
}

function buildCustomPayloadCell(customPayloadEnabled: boolean, customPayloadHex: string): Cell | null {
  if (!customPayloadEnabled || !customPayloadHex.trim()) {
    return null
  }

  const payloadBytes = hexToBytes(customPayloadHex, 'Custom payload hex')

  if (!payloadBytes) {
    return null
  }

  return beginCell().storeBuffer(Buffer.from(payloadBytes)).endCell()
}

export async function createJettonTransferTransaction(
  formValues: TransferFormValues,
  connectedWalletAddress: string
): Promise<TransactionPreview> {
  const walletAddress = parseAddress(connectedWalletAddress, 'Connected wallet address')
  const jettonMasterAddress = parseAddress(
    formValues.jettonMasterAddress,
    'Jetton master contract address'
  )
  const destinationAddress = parseAddress(formValues.destinationAddress, 'Destination address')
  const responseDestination = parseAddress(
    formValues.responseDestination,
    'Response destination'
  )
  const queryId = parseQueryId(formValues.queryId)
  const tonAmount = parseTonAmount(formValues.tonAmount, 'TON amount')
  const forwardTonAmount = parseTonAmount(formValues.forwardTonAmount, 'Forward TON amount')
  const jettonAmount = parseJettonAmount(formValues.jettonAmount)
  const customPayloadCell = buildCustomPayloadCell(
    formValues.customPayloadEnabled,
    formValues.customPayloadHex
  )
  const forwardPayloadCell = buildForwardPayloadCell(
    formValues.forwardPayloadType,
    formValues.forwardPayloadValue
  )
  const jettonWalletAddress = await resolveJettonWalletAddress(jettonMasterAddress, walletAddress)

  const bodyBuilder = beginCell()
    .storeUint(0x0f8a7ea5, 32)
    .storeUint(queryId, 64)
    .storeCoins(jettonAmount)
    .storeAddress(destinationAddress)
    .storeAddress(responseDestination)
  if (customPayloadCell) {
    bodyBuilder.storeBit(1).storeRef(customPayloadCell)
  } else {
    bodyBuilder.storeBit(0)
  }

  bodyBuilder
    .storeCoins(forwardTonAmount)

  if (forwardPayloadCell) {
    bodyBuilder.storeBit(1).storeRef(forwardPayloadCell)
  } else {
    bodyBuilder.storeBit(0)
  }

  const body = bodyBuilder.endCell()
  const transaction: TonConnectTransaction = {
    validUntil: Math.floor(Date.now() / 1000) + 5 * 60,
    messages: [
      {
        address: jettonWalletAddress.toString(),
        amount: tonAmount.toString(),
        payload: toBase64Cell(body),
      },
    ],
  }

  return {
    jettonWalletAddress: jettonWalletAddress.toString(),
    body,
    transaction,
  }
}

export function getExplorerPreview(body: Cell): string {
  return toBase64Cell(body)
}

export function normalizePresetSelection(
  presetId: JettonPresetId,
  currentAddress: string
): string {
  if (presetId === 'custom') {
    return currentAddress
  }

  return getJettonPresetAddress(presetId)
}
