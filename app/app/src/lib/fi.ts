import { Address, beginCell, storeStateInit, toNano } from '@ton/core';
import type { SendTransactionRequest } from '@tonconnect/ui-react';

import { fossFi } from '../../../../wrappers-ts/FossFi.gen';
import { FiWalletStore, fossFiWallet } from '../../../../wrappers-ts/FossFiWallet.gen';
import { IS_TESTNET, TON_CHAIN, tonClient } from './ton';
import { FI_ADDRESS } from '../../../../phosphate/scripts/consts';

// type Payload = PayloadInline | PayloadInRef;

const UINT32_MAX = 4_294_967_295n;
const TRANSACTION_TTL_SECONDS = 5 * 60;

// export const DEFAULT_DEPLOY_VALUE = '0.05';
export const DEFAULT_FEE = '0.55';

export interface FiWalletPreview {
  address: string;
  contract: fossFiWallet;
  balance: bigint;
  owner: string;
}

export interface FiwalletSnapshot {
  address: string;
  isDeployed: boolean;
  state: FiWalletStore | null;
}

export type FiWalletAction = 'invite' | 'vote';

function parseUint32(
  value: string,
  label: string,
  options?: { allowZero?: boolean },
): bigint {
  const trimmed = value.trim();

  if (!/^\d+$/.test(trimmed)) {
    throw new Error(`${label} must be a whole number.`);
  }

  const parsed = BigInt(trimmed);
  const allowZero = options?.allowZero ?? true;

  if (!allowZero && parsed === 0n) {
    throw new Error(`${label} must be greater than 0.`);
  }

  if (parsed > UINT32_MAX) {
    throw new Error(`${label} must fit into uint32.`);
  }

  return parsed;
}

function parseTonAmount(value: string, label: string): bigint {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error(`${label} is required.`);
  }

  return toNano(trimmed);
}

function encodeStateInit(contract: fossFiWallet): string {
  if (!contract.init) {
    throw new Error('fossFiWallet init is missing.');
  }

  return beginCell()
    .store(storeStateInit(contract.init))
    .endCell()
    .toBoc()
    .toString('base64');
}

export function encodePayload(action: FiWalletAction, sender: Address, receiver: Address, amount: bigint, comments: string): string {
  const rawBody = {
    queryId: 0n,
    jettonAmount: action === 'invite' ? toNano('0.1') : amount,
    transferRecipient: receiver,
    sendExcessesTo: sender,
    customPayload: null,
    forwardTonAmount: 1n,
    forwardPayload: comments,
    // forwardPayload: comment(comments).beginParse(),
    // forwardPayload: PayloadInline.fromSlice(comment(comments).beginParse()),
  };

  const body = fossFiWallet.createCellOfOthersActions(rawBody);

  return body.toBoc().toString('base64');
}

function transactionExpiry(): number {
  return Math.floor(Date.now() / 1000) + TRANSACTION_TTL_SECONDS;
}

export function formatAddress(address: Address): string {
  return address.toString({
    bounceable: false,
    testOnly: IS_TESTNET,
  });
}

export function normalizeCounterAddress(address: string): string {
  return formatAddress(Address.parse(address));
}

// export function getCounterPreview(
//   counterIdValue: string,
//   ownerAddressValue: string,
// ): FiWalletPreview {
//   const id = parseUint32(counterIdValue, 'fossFiWallet ID');
//   const owner = Address.parse(ownerAddressValue);
  
//   const contract = fossFiWallet.fromStorage();

//   return {
//     address: formatAddress(contract.address),
//     contract,
//     balance: 0n,
//     owner: formatAddress(owner),
//   };
// }

export async function isContractDeployed(address: Address): Promise<boolean> {
  return tonClient.isContractDeployed(address);
}

export async function readFiWallet(
  addressValue: string,
): Promise<FiwalletSnapshot> {
  const address = Address.parse(addressValue);
  const normalizedAddress = formatAddress(address);
  const isDeployed = await tonClient.isContractDeployed(address);

  if (!isDeployed) {
    return {
      address: normalizedAddress,
      isDeployed: false,
      state: null,
    };
  }

  const fi = tonClient.open(fossFi.fromAddress(Address.parse(FI_ADDRESS)));
  const fiWalletAddr = await fi.getWalletAddress(address);
  const contract = tonClient.open(fossFiWallet.fromAddress(fiWalletAddr));
  const fiWalletData = await contract.getWalletDataAll();

  return {
    address: normalizedAddress,
    isDeployed: isDeployed,
    state:fiWalletData
  };
}

// export function buildDeployTransaction(
//   deployAmountValue: string,
//   ownerAddressValue: string,
// ): {
//   address: string;
//   request: SendTransactionRequest;
//   // preview: FiWalletPreview;
// } {
//   // const preview = getCounterPreview(counterIdValue, ownerAddressValue);
//   const preview = ;
//   const amount = parseTonAmount(deployAmountValue, 'Deploy value');

//   return {
//     address: preview.address,
//     // preview,
//     request: {
//       network: TON_CHAIN,
//       validUntil: transactionExpiry(),
//       messages: [
//         {
//           address: preview.address,
//           amount: amount.toString(),
//           // stateInit: encodeStateInit(preview.contract),
//         },
//       ],
//     },
//   };
// }

export function buildFiWalletActionTransaction(options: {
  action: FiWalletAction;
  jettonAmount: string;
  senderAddress: string;
  comments: string;
  addressValue: string; // receiver
  fee: string; // fees
}): { address: string; request: SendTransactionRequest } {
  const address = Address.parse(options.addressValue);
  const sender = Address.parse(options.senderAddress);
  const normalizedAddress = formatAddress(address);
  const amount = parseTonAmount(options.fee, 'Message value');

  return {
    address: normalizedAddress,
    request: {
      network: TON_CHAIN,
      validUntil: transactionExpiry(),
      messages: [
        {
          address: normalizedAddress,
          amount: amount.toString(),
          payload: encodePayload(options.action, sender, address, parseTonAmount(options.jettonAmount, 'Jetton amount'), options.comments),
        },
      ],
    },
  };
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const errorWithStatus = error as {
      message?: string;
      response?: { status?: number };
      status?: number;
    };
    const status =
      errorWithStatus.response?.status ?? errorWithStatus.status ?? null;

    if (
      status === 429 ||
      errorWithStatus.message?.includes('status code 429')
    ) {
      return 'Toncenter rate limit reached (HTTP 429). This app reads chain data through Toncenter, so wait a bit and try again, or add TONCENTER_TESTNET_API_KEY / TONCENTER_MAINNET_API_KEY for higher limits.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error.';
}
