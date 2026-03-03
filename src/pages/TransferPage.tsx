import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { useTonAddress, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import {
  JETTON_PRESETS,
  createJettonTransferTransaction,
  getJettonPresetAddress,
  normalizePresetSelection,
} from '../lib/jettonTransfer'
import type {
  ForwardPayloadType,
  FormStatus,
  JettonPresetId,
  TransferFormValues,
  TransactionPreview,
} from '../types'

const initialStatus: FormStatus = {
  type: '',
  message: '',
}

function TransferPage() {
  const wallet = useTonWallet()
  const connectedWalletAddress = useTonAddress()
  const [tonConnectUI] = useTonConnectUI()
  const [selectedPreset, setSelectedPreset] = useState<JettonPresetId>('usdt')
  const [formValues, setFormValues] = useState<TransferFormValues>({
    queryId: '0',
    jettonMasterAddress: getJettonPresetAddress('usdt'),
    destinationAddress: '',
    tonAmount: '0.1',
    jettonAmount: '',
    responseDestination: connectedWalletAddress,
    customPayloadEnabled: false,
    customPayloadHex: '',
    forwardTonAmount: '0',
    forwardPayloadType: 'text-comment',
    forwardPayloadValue: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<FormStatus>(initialStatus)

  useEffect(() => {
    setFormValues((current) => ({
      ...current,
      responseDestination: connectedWalletAddress,
    }))
  }, [connectedWalletAddress])

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = event.target
    const value =
      event.target instanceof HTMLInputElement && event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value

    setFormValues((current) => {
      return {
        ...current,
        [name]: value,
      }
    })

    setStatus(initialStatus)
  }

  const handlePresetChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const presetId = event.target.value as JettonPresetId
    setSelectedPreset(presetId)
    setFormValues((current) => ({
      ...current,
      jettonMasterAddress: normalizePresetSelection(presetId, current.jettonMasterAddress),
    }))
    setStatus(initialStatus)
  }

  const forwardPayloadLabel: Record<ForwardPayloadType, string> = {
    'text-comment': 'Text comment',
    'binary-comment': 'Binary comment hex',
    custom: 'Custom payload hex',
  }

  const forwardPayloadDescription: Record<ForwardPayloadType, string> = {
    'text-comment':
      'Creates a payload that starts with 0x00000000 and stores the rest as UTF-8 text.',
    'binary-comment':
      'Creates a payload that starts with 0x00000000ff and then appends your hex bytes.',
    custom: 'Sends raw payload bytes in hex format without any prefixes.',
  }

  const forwardPayloadPlaceholder: Record<ForwardPayloadType, string> = {
    'text-comment': 'For coffee',
    'binary-comment': 'deadbeef',
    custom: 'b5ee9c72...',
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!wallet || !connectedWalletAddress) {
      setStatus({
        type: 'error',
        message: 'Connect your wallet first.',
      })
      return
    }

    setIsSubmitting(true)
    setStatus(initialStatus)

    try {
      const { transaction }: TransactionPreview = await createJettonTransferTransaction(
        formValues,
        connectedWalletAddress
      )

      await tonConnectUI.sendTransaction(transaction, {
        modals: ['before', 'success', 'error'],
        notifications: ['before', 'success', 'error'],
      })

      setStatus({
        type: 'success',
        message: 'Transfer request sent to the connected wallet for confirmation.',
      })
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unable to prepare the transfer.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!wallet) {
    return (
      <main className="app-content wallet-warning" aria-live="polite">
        <span className="page-kicker">Wallet Required</span>
        <h2>Connect your wallet first</h2>
        <p>
          Use the TON Connect button in the header to connect a wallet before accessing the
          transfer interface.
        </p>
      </main>
    )
  }

  return (
    <main className="app-content">
      <div className="page-intro">
        <span className="page-kicker">Transfer</span>
        <h2>Transfer Jettons</h2>
        <p>
          Build a standard jetton transfer message from the connected wallet without using a seed
          phrase in the frontend.
        </p>
      </div>

      <section className="transfer-layout" aria-label="Transfer jettons">
        <form className="transfer-panel" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="jettonPreset">Standard jetton contracts</label>
            <p className="field-description">
              Choose one of the built-in master contracts, or switch to custom to enter your own.
            </p>
            <select id="jettonPreset" value={selectedPreset} onChange={handlePresetChange}>
              {JETTON_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.label}
                </option>
              ))}
              <option value="custom">Custom</option>
            </select>
          </div>

          {selectedPreset === 'custom' ? (
            <div className="field-group">
              <label htmlFor="jettonMasterAddress">Jetton master contract address</label>
              <p className="field-description">
                Enter the master contract address manually for a jetton outside the USDT and USDe presets.
              </p>
              <input
                id="jettonMasterAddress"
                name="jettonMasterAddress"
                type="text"
                value={formValues.jettonMasterAddress}
                onChange={handleFieldChange}
                placeholder="EQ..."
                spellCheck={false}
              />
            </div>
          ) : (
            <div className="field-group">
              <label>Jetton master contract address</label>
              <p className="field-description">
                Using the standard {selectedPreset.toUpperCase()} master contract:
              </p>
              <p className="field-value">{formValues.jettonMasterAddress}</p>
            </div>
          )}

          <div className="field-group">
            <label htmlFor="queryId">Query ID</label>
            <p className="field-description">
              Arbitrary uint64 request number included in the transfer message.
            </p>
            <input
              id="queryId"
              name="queryId"
              type="text"
              value={formValues.queryId}
              onChange={handleFieldChange}
              placeholder="0"
              inputMode="numeric"
            />
          </div>

          <div className="field-group">
            <label htmlFor="destinationAddress">Destination address</label>
            <p className="field-description">
              Wallet address that should receive the jettons.
            </p>
            <input
              id="destinationAddress"
              name="destinationAddress"
              type="text"
              value={formValues.destinationAddress}
              onChange={handleFieldChange}
              placeholder="EQ..."
              spellCheck={false}
            />
          </div>

          <div className="field-row">
            <div className="field-group">
              <label htmlFor="tonAmount">TON amount</label>
              <p className="field-description">
                TON attached to the message to cover transfer execution costs.
              </p>
              <input
                id="tonAmount"
                name="tonAmount"
                type="text"
                value={formValues.tonAmount}
                onChange={handleFieldChange}
                placeholder="0.1"
              />
            </div>

            <div className="field-group">
              <label htmlFor="jettonAmount">Jetton amount</label>
              <p className="field-description">
                Raw token amount in base units, not a formatted decimal display value.
              </p>
              <input
                id="jettonAmount"
                name="jettonAmount"
                type="text"
                value={formValues.jettonAmount}
                onChange={handleFieldChange}
                placeholder="5000000000"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="responseDestination">Response destination</label>
            <p className="field-description">
              Address that receives any excess TON or response from the transfer.
            </p>
            <input
              id="responseDestination"
              name="responseDestination"
              type="text"
              value={formValues.responseDestination}
              onChange={handleFieldChange}
              placeholder="EQ..."
              spellCheck={false}
            />
          </div>

          <div className="field-group">
            <label className="checkbox-row" htmlFor="customPayloadEnabled">
              <input
                id="customPayloadEnabled"
                name="customPayloadEnabled"
                type="checkbox"
                checked={formValues.customPayloadEnabled}
                onChange={handleFieldChange}
              />
              <span>Custom payload</span>
            </label>
            <p className="field-description">
              Adds the optional `custom_payload` cell before `forward_ton_amount`.
            </p>
          </div>

          {formValues.customPayloadEnabled ? (
            <div className="field-group">
              <label htmlFor="customPayloadHex">Custom payload hex</label>
              <p className="field-description">
                Raw hex bytes stored inside the optional custom payload cell.
              </p>
              <input
                id="customPayloadHex"
                name="customPayloadHex"
                type="text"
                value={formValues.customPayloadHex}
                onChange={handleFieldChange}
                placeholder="deadbeef"
                spellCheck={false}
              />
            </div>
          ) : null}

          <div className="field-row">
            <div className="field-group">
              <label htmlFor="forwardTonAmount">Forward TON amount</label>
              <p className="field-description">
                Optional TON to forward with the transfer notification to the recipient.
              </p>
              <input
                id="forwardTonAmount"
                name="forwardTonAmount"
                type="text"
                value={formValues.forwardTonAmount}
                onChange={handleFieldChange}
                placeholder="0"
              />
            </div>

            <div className="field-group">
              <label htmlFor="forwardPayloadType">Forward payload format</label>
              <p className="field-description">
                Choose whether the payload should be encoded as a text comment, binary comment,
                or raw custom payload.
              </p>
              <select
                id="forwardPayloadType"
                name="forwardPayloadType"
                value={formValues.forwardPayloadType}
                onChange={handleFieldChange}
              >
                <option value="text-comment">Text comment</option>
                <option value="binary-comment">Binary comment (hex format)</option>
                <option value="custom">Custom (hex format)</option>
              </select>
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="forwardPayloadValue">{forwardPayloadLabel[formValues.forwardPayloadType]}</label>
            <p className="field-description">
              {forwardPayloadDescription[formValues.forwardPayloadType]}
            </p>
            <input
              id="forwardPayloadValue"
              name="forwardPayloadValue"
              type="text"
              value={formValues.forwardPayloadValue}
              onChange={handleFieldChange}
              placeholder={forwardPayloadPlaceholder[formValues.forwardPayloadType]}
              spellCheck={formValues.forwardPayloadType === 'text-comment'}
            />
          </div>

          {status.message ? (
            <p className={status.type === 'error' ? 'form-status is-error' : 'form-status is-success'}>
              {status.message}
            </p>
          ) : null}

          <button type="submit" className="primary-action" disabled={isSubmitting}>
            {isSubmitting ? 'Preparing transfer...' : 'Transfer Jettons'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default TransferPage
