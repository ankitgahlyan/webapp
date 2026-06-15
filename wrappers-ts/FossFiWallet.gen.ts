// AUTO-GENERATED, do not edit
// It's a TypeScript wrapper for a fossFiWallet contract in Tolk.
/* eslint-disable */

import * as c from '@ton/core';
import { beginCell, ContractProvider, Sender, SendMode } from '@ton/core';

// ————————————————————————————————————————————
//   predefined types and functions
//

type RemainingBitsAndRefs = c.Slice

type StoreCallback<T> = (obj: T, b: c.Builder) => void
type LoadCallback<T> = (s: c.Slice) => T

export type CellRef<T> = {
    ref: T
}

function makeCellFrom<T>(self: T, storeFn_T: StoreCallback<T>): c.Cell {
    let b = beginCell();
    storeFn_T(self, b);
    return b.endCell();
}

function loadAndCheckPrefix32(s: c.Slice, expected: number, structName: string): void {
    let prefix = s.loadUint(32);
    if (prefix !== expected) {
        throw new Error(`Incorrect prefix for '${structName}': expected 0x${expected.toString(16).padStart(8, '0')}, got 0x${prefix.toString(16).padStart(8, '0')}`);
    }
}

function lookupPrefix(s: c.Slice, expected: number, prefixLen: number): boolean {
    return s.remainingBits >= prefixLen && s.preloadUint(prefixLen) === expected;
}

function throwNonePrefixMatch(fieldPath: string): never {
    throw new Error(`Incorrect prefix for '${fieldPath}': none of variants matched`);
}

function storeCellRef<T>(cell: CellRef<T>, b: c.Builder, storeFn_T: StoreCallback<T>): void {
    let b_ref = c.beginCell();
    storeFn_T(cell.ref, b_ref);
    b.storeRef(b_ref.endCell());
}

function loadCellRef<T>(s: c.Slice, loadFn_T: LoadCallback<T>): CellRef<T> {
    let s_ref = s.loadRef().beginParse();
    return { ref: loadFn_T(s_ref) };
}

function storeTolkRemaining(v: RemainingBitsAndRefs, b: c.Builder): void {
    b.storeSlice(v);
}

function loadTolkRemaining(s: c.Slice): RemainingBitsAndRefs {
    let rest = s.clone();
    s.loadBits(s.remainingBits);
    while (s.remainingRefs) {
        s.loadRef();
    }
    return rest;
}

function storeTolkNullable<T>(v: T | null, b: c.Builder, storeFn_T: StoreCallback<T>): void {
    if (v === null) {
        b.storeUint(0, 1);
    } else {
        b.storeUint(1, 1);
        storeFn_T(v, b);
    }
}

function createDictionaryValue<V>(loadFn_V: LoadCallback<V>, storeFn_V: StoreCallback<V>): c.DictionaryValue<V> {
    return {
        serialize(self: V, b: c.Builder) {
            storeFn_V(self, b);
        },
        parse(s: c.Slice): V {
            const value = loadFn_V(s);
            s.endParse();
            return value;
        }
    }
}

// ————————————————————————————————————————————
//   parse get methods result from a TVM stack
//

class StackReader {
    constructor(private tuple: c.TupleItem[]) {
    }

    static fromGetMethod(expectedN: number, getMethodResult: { stack: c.TupleReader }): StackReader {
        let tuple = [] as c.TupleItem[];
        while (getMethodResult.stack.remaining) {
            tuple.push(getMethodResult.stack.pop());
        }
        if (tuple.length !== expectedN) {
            throw new Error(`expected ${expectedN} stack width, got ${tuple.length}`);
        }
        return new StackReader(tuple);
    }

    private popExpecting<ItemT>(itemType: string): ItemT {
        const item = this.tuple.shift();
        if (item?.type === itemType) {
            return item as ItemT;
        }
        throw new Error(`not '${itemType}' on a stack`);
    }

    private popCellLike(): c.Cell {
        const item = this.tuple.shift();
        if (item && (item.type === 'cell' || item.type === 'slice' || item.type === 'builder')) {
            return item.cell;
        }
        throw new Error(`not cell/slice on a stack`);
    }

    readBigInt(): bigint {
        return this.popExpecting<c.TupleItemInt>('int').value;
    }

    readBoolean(): boolean {
        return this.popExpecting<c.TupleItemInt>('int').value !== 0n;
    }

    readCell(): c.Cell {
        return this.popCellLike();
    }

    readSlice(): c.Slice {
        return this.popCellLike().beginParse();
    }

    readSnakeString(): string {
        return this.readCell().beginParse().loadStringTail();
    }

    readCellRef<T>(loadFn_T: LoadCallback<T>): CellRef<T> {
        return { ref: loadFn_T(this.readCell().beginParse()) };
    }
}

// ————————————————————————————————————————————
//   auto-generated serializers to/from cells
//

type coins = bigint

type uint2 = bigint
type uint4 = bigint
type uint8 = bigint
type uint10 = bigint
type uint20 = bigint
type uint32 = bigint
type uint64 = bigint

/**
 > type ForwardPayloadRemainder = RemainingBitsAndRefs
 */
export type ForwardPayloadRemainder = RemainingBitsAndRefs

export const ForwardPayloadRemainder = {
    fromSlice(s: c.Slice): ForwardPayloadRemainder {
        return loadTolkRemaining(s);
    },
    store(self: ForwardPayloadRemainder, b: c.Builder): void {
        storeTolkRemaining(self, b);
    },
    toCell(self: ForwardPayloadRemainder): c.Cell {
        return makeCellFrom<ForwardPayloadRemainder>(self, ForwardPayloadRemainder.store);
    }
}

/**
 > struct (0x0f8a7ea5) AskToTransfer {
 >     queryId: uint64
 >     jettonAmount: coins
 >     transferRecipient: address
 >     sendExcessesTo: address?
 >     customPayload: cell?
 >     forwardTonAmount: coins
 >     forwardPayload: ForwardPayloadRemainder
 > }
 */
export interface AskToTransfer {
    readonly $: 'AskToTransfer'
    queryId: uint64
    jettonAmount: coins
    transferRecipient: c.Address
    sendExcessesTo: c.Address | null
    customPayload: c.Cell | null
    forwardTonAmount: coins
    forwardPayload: ForwardPayloadRemainder
}

export const AskToTransfer = {
    PREFIX: 0x0f8a7ea5,

    create(args: {
        queryId: uint64
        jettonAmount: coins
        transferRecipient: c.Address
        sendExcessesTo: c.Address | null
        customPayload: c.Cell | null
        forwardTonAmount: coins
        forwardPayload: ForwardPayloadRemainder
    }): AskToTransfer {
        return {
            $: 'AskToTransfer',
            ...args
        }
    },
    fromSlice(s: c.Slice): AskToTransfer {
        loadAndCheckPrefix32(s, 0x0f8a7ea5, 'AskToTransfer');
        return {
            $: 'AskToTransfer',
            queryId: s.loadUintBig(64),
            jettonAmount: s.loadCoins(),
            transferRecipient: s.loadAddress(),
            sendExcessesTo: s.loadMaybeAddress(),
            customPayload: s.loadBoolean() ? s.loadRef() : null,
            forwardTonAmount: s.loadCoins(),
            forwardPayload: ForwardPayloadRemainder.fromSlice(s),
        }
    },
    store(self: AskToTransfer, b: c.Builder): void {
        b.storeUint(0x0f8a7ea5, 32);
        b.storeUint(self.queryId, 64);
        b.storeCoins(self.jettonAmount);
        b.storeAddress(self.transferRecipient);
        b.storeAddress(self.sendExcessesTo);
        storeTolkNullable<c.Cell>(self.customPayload, b,
            (v,b) => b.storeRef(v)
        );
        b.storeCoins(self.forwardTonAmount);
        ForwardPayloadRemainder.store(self.forwardPayload, b);
    },
    toCell(self: AskToTransfer): c.Cell {
        return makeCellFrom<AskToTransfer>(self, AskToTransfer.store);
    }
}

/**
 > struct (0x7362d09c) TransferNotificationForRecipient {
 >     queryId: uint64
 >     jettonAmount: coins
 >     transferInitiator: address
 >     forwardPayload: ForwardPayloadRemainder
 > }
 */
export interface TransferNotificationForRecipient {
    readonly $: 'TransferNotificationForRecipient'
    queryId: uint64
    jettonAmount: coins
    transferInitiator: c.Address
    forwardPayload: ForwardPayloadRemainder
}

export const TransferNotificationForRecipient = {
    PREFIX: 0x7362d09c,

    create(args: {
        queryId: uint64
        jettonAmount: coins
        transferInitiator: c.Address
        forwardPayload: ForwardPayloadRemainder
    }): TransferNotificationForRecipient {
        return {
            $: 'TransferNotificationForRecipient',
            ...args
        }
    },
    fromSlice(s: c.Slice): TransferNotificationForRecipient {
        loadAndCheckPrefix32(s, 0x7362d09c, 'TransferNotificationForRecipient');
        return {
            $: 'TransferNotificationForRecipient',
            queryId: s.loadUintBig(64),
            jettonAmount: s.loadCoins(),
            transferInitiator: s.loadAddress(),
            forwardPayload: ForwardPayloadRemainder.fromSlice(s),
        }
    },
    store(self: TransferNotificationForRecipient, b: c.Builder): void {
        b.storeUint(0x7362d09c, 32);
        b.storeUint(self.queryId, 64);
        b.storeCoins(self.jettonAmount);
        b.storeAddress(self.transferInitiator);
        ForwardPayloadRemainder.store(self.forwardPayload, b);
    },
    toCell(self: TransferNotificationForRecipient): c.Cell {
        return makeCellFrom<TransferNotificationForRecipient>(self, TransferNotificationForRecipient.store);
    }
}

/**
 > struct (0x178d4519) InternalTransferStep {
 >     queryId: uint64
 >     jettonAmount: coins
 >     version: uint10
 >     transferredAsCredit: bool
 >     transferInitiator: address
 >     sendExcessesTo: address?
 >     forwardTonAmount: coins
 >     forwardPayload: ForwardPayloadRemainder
 > }
 */
export interface InternalTransferStep {
    readonly $: 'InternalTransferStep'
    queryId: uint64
    jettonAmount: coins
    version: uint10
    transferredAsCredit: boolean /* = false */
    transferInitiator: c.Address
    sendExcessesTo: c.Address | null
    forwardTonAmount: coins
    forwardPayload: ForwardPayloadRemainder
}

export const InternalTransferStep = {
    PREFIX: 0x178d4519,

    create(args: {
        queryId: uint64
        jettonAmount: coins
        version: uint10
        transferredAsCredit?: boolean /* = false */
        transferInitiator: c.Address
        sendExcessesTo: c.Address | null
        forwardTonAmount: coins
        forwardPayload: ForwardPayloadRemainder
    }): InternalTransferStep {
        return {
            $: 'InternalTransferStep',
            transferredAsCredit: false,
            ...args
        }
    },
    fromSlice(s: c.Slice): InternalTransferStep {
        loadAndCheckPrefix32(s, 0x178d4519, 'InternalTransferStep');
        return {
            $: 'InternalTransferStep',
            queryId: s.loadUintBig(64),
            jettonAmount: s.loadCoins(),
            version: s.loadUintBig(10),
            transferredAsCredit: s.loadBoolean(),
            transferInitiator: s.loadAddress(),
            sendExcessesTo: s.loadMaybeAddress(),
            forwardTonAmount: s.loadCoins(),
            forwardPayload: ForwardPayloadRemainder.fromSlice(s),
        }
    },
    store(self: InternalTransferStep, b: c.Builder): void {
        b.storeUint(0x178d4519, 32);
        b.storeUint(self.queryId, 64);
        b.storeCoins(self.jettonAmount);
        b.storeUint(self.version, 10);
        b.storeBit(self.transferredAsCredit);
        b.storeAddress(self.transferInitiator);
        b.storeAddress(self.sendExcessesTo);
        b.storeCoins(self.forwardTonAmount);
        ForwardPayloadRemainder.store(self.forwardPayload, b);
    },
    toCell(self: InternalTransferStep): c.Cell {
        return makeCellFrom<InternalTransferStep>(self, InternalTransferStep.store);
    }
}

/**
 > struct (0xd53276db) ReturnExcessesBack {
 >     queryId: uint64
 > }
 */
export interface ReturnExcessesBack {
    readonly $: 'ReturnExcessesBack'
    queryId: uint64
}

export const ReturnExcessesBack = {
    PREFIX: 0xd53276db,

    create(args: {
        queryId: uint64
    }): ReturnExcessesBack {
        return {
            $: 'ReturnExcessesBack',
            ...args
        }
    },
    fromSlice(s: c.Slice): ReturnExcessesBack {
        loadAndCheckPrefix32(s, 0xd53276db, 'ReturnExcessesBack');
        return {
            $: 'ReturnExcessesBack',
            queryId: s.loadUintBig(64),
        }
    },
    store(self: ReturnExcessesBack, b: c.Builder): void {
        b.storeUint(0xd53276db, 32);
        b.storeUint(self.queryId, 64);
    },
    toCell(self: ReturnExcessesBack): c.Cell {
        return makeCellFrom<ReturnExcessesBack>(self, ReturnExcessesBack.store);
    }
}

/**
 > struct (0x595f07bc) AskToBurn {
 >     queryId: uint64
 >     jettonAmount: coins
 >     sendExcessesTo: address?
 >     customPayload: cell?
 > }
 */
export interface AskToBurn {
    readonly $: 'AskToBurn'
    queryId: uint64
    jettonAmount: coins
    sendExcessesTo: c.Address | null
    customPayload: c.Cell | null
}

export const AskToBurn = {
    PREFIX: 0x595f07bc,

    create(args: {
        queryId: uint64
        jettonAmount: coins
        sendExcessesTo: c.Address | null
        customPayload: c.Cell | null
    }): AskToBurn {
        return {
            $: 'AskToBurn',
            ...args
        }
    },
    fromSlice(s: c.Slice): AskToBurn {
        loadAndCheckPrefix32(s, 0x595f07bc, 'AskToBurn');
        return {
            $: 'AskToBurn',
            queryId: s.loadUintBig(64),
            jettonAmount: s.loadCoins(),
            sendExcessesTo: s.loadMaybeAddress(),
            customPayload: s.loadBoolean() ? s.loadRef() : null,
        }
    },
    store(self: AskToBurn, b: c.Builder): void {
        b.storeUint(0x595f07bc, 32);
        b.storeUint(self.queryId, 64);
        b.storeCoins(self.jettonAmount);
        b.storeAddress(self.sendExcessesTo);
        storeTolkNullable<c.Cell>(self.customPayload, b,
            (v,b) => b.storeRef(v)
        );
    },
    toCell(self: AskToBurn): c.Cell {
        return makeCellFrom<AskToBurn>(self, AskToBurn.store);
    }
}

/**
 > struct (0x7bdd97de) NotifyMinter {
 >     queryId: uint64
 >     jettonAmount: coins
 >     burnInitiator: address
 >     sendExcessesTo: address?
 > }
 */
export interface NotifyMinter {
    readonly $: 'NotifyMinter'
    queryId: uint64
    jettonAmount: coins
    burnInitiator: c.Address
    sendExcessesTo: c.Address | null
}

export const NotifyMinter = {
    PREFIX: 0x7bdd97de,

    create(args: {
        queryId: uint64
        jettonAmount: coins
        burnInitiator: c.Address
        sendExcessesTo: c.Address | null
    }): NotifyMinter {
        return {
            $: 'NotifyMinter',
            ...args
        }
    },
    fromSlice(s: c.Slice): NotifyMinter {
        loadAndCheckPrefix32(s, 0x7bdd97de, 'NotifyMinter');
        return {
            $: 'NotifyMinter',
            queryId: s.loadUintBig(64),
            jettonAmount: s.loadCoins(),
            burnInitiator: s.loadAddress(),
            sendExcessesTo: s.loadMaybeAddress(),
        }
    },
    store(self: NotifyMinter, b: c.Builder): void {
        b.storeUint(0x7bdd97de, 32);
        b.storeUint(self.queryId, 64);
        b.storeCoins(self.jettonAmount);
        b.storeAddress(self.burnInitiator);
        b.storeAddress(self.sendExcessesTo);
    },
    toCell(self: NotifyMinter): c.Cell {
        return makeCellFrom<NotifyMinter>(self, NotifyMinter.store);
    }
}

/**
 > struct (0x642b7d07) MintNewJettons {
 >     queryId: uint64
 >     mintRecipient: address
 >     tonAmount: coins
 >     internalTransferMsg: Cell<InternalTransferStep>
 > }
 */
export interface MintNewJettons {
    readonly $: 'MintNewJettons'
    queryId: uint64
    mintRecipient: c.Address
    tonAmount: coins
    internalTransferMsg: CellRef<InternalTransferStep>
}

export const MintNewJettons = {
    PREFIX: 0x642b7d07,

    create(args: {
        queryId: uint64
        mintRecipient: c.Address
        tonAmount: coins
        internalTransferMsg: CellRef<InternalTransferStep>
    }): MintNewJettons {
        return {
            $: 'MintNewJettons',
            ...args
        }
    },
    fromSlice(s: c.Slice): MintNewJettons {
        loadAndCheckPrefix32(s, 0x642b7d07, 'MintNewJettons');
        return {
            $: 'MintNewJettons',
            queryId: s.loadUintBig(64),
            mintRecipient: s.loadAddress(),
            tonAmount: s.loadCoins(),
            internalTransferMsg: loadCellRef<InternalTransferStep>(s, InternalTransferStep.fromSlice),
        }
    },
    store(self: MintNewJettons, b: c.Builder): void {
        b.storeUint(0x642b7d07, 32);
        b.storeUint(self.queryId, 64);
        b.storeAddress(self.mintRecipient);
        b.storeCoins(self.tonAmount);
        storeCellRef<InternalTransferStep>(self.internalTransferMsg, b, InternalTransferStep.store);
    },
    toCell(self: MintNewJettons): c.Cell {
        return makeCellFrom<MintNewJettons>(self, MintNewJettons.store);
    }
}

/**
 > struct (0x2508d66a) Upgrade {
 >     walletUpgrade: bool
 >     walletVersion: uint10
 >     sender: address
 >     newData: cell?
 >     newCode: cell?
 > }
 */
export interface Upgrade {
    readonly $: 'Upgrade'
    walletUpgrade: boolean /* = true */
    walletVersion: uint10
    sender: c.Address
    newData: c.Cell | null /* = null */
    newCode: c.Cell | null /* = null */
}

export const Upgrade = {
    PREFIX: 0x2508d66a,

    create(args: {
        walletUpgrade?: boolean /* = true */
        walletVersion: uint10
        sender: c.Address
        newData?: c.Cell | null /* = null */
        newCode?: c.Cell | null /* = null */
    }): Upgrade {
        return {
            $: 'Upgrade',
            walletUpgrade: true,
            newData: null,
            newCode: null,
            ...args
        }
    },
    fromSlice(s: c.Slice): Upgrade {
        loadAndCheckPrefix32(s, 0x2508d66a, 'Upgrade');
        return {
            $: 'Upgrade',
            walletUpgrade: s.loadBoolean(),
            walletVersion: s.loadUintBig(10),
            sender: s.loadAddress(),
            newData: s.loadBoolean() ? s.loadRef() : null,
            newCode: s.loadBoolean() ? s.loadRef() : null,
        }
    },
    store(self: Upgrade, b: c.Builder): void {
        b.storeUint(0x2508d66a, 32);
        b.storeBit(self.walletUpgrade);
        b.storeUint(self.walletVersion, 10);
        b.storeAddress(self.sender);
        storeTolkNullable<c.Cell>(self.newData, b,
            (v,b) => b.storeRef(v)
        );
        storeTolkNullable<c.Cell>(self.newCode, b,
            (v,b) => b.storeRef(v)
        );
    },
    toCell(self: Upgrade): c.Cell {
        return makeCellFrom<Upgrade>(self, Upgrade.store);
    }
}

/**
 > struct (0xd372158c) TopUpTons {
 >     queryId: uint64
 > }
 */
export interface TopUpTons {
    readonly $: 'TopUpTons'
    queryId: uint64
}

export const TopUpTons = {
    PREFIX: 0xd372158c,

    create(args: {
        queryId: uint64
    }): TopUpTons {
        return {
            $: 'TopUpTons',
            ...args
        }
    },
    fromSlice(s: c.Slice): TopUpTons {
        loadAndCheckPrefix32(s, 0xd372158c, 'TopUpTons');
        return {
            $: 'TopUpTons',
            queryId: s.loadUintBig(64),
        }
    },
    store(self: TopUpTons, b: c.Builder): void {
        b.storeUint(0xd372158c, 32);
        b.storeUint(self.queryId, 64);
    },
    toCell(self: TopUpTons): c.Cell {
        return makeCellFrom<TopUpTons>(self, TopUpTons.store);
    }
}

/**
 > struct (0x00000001) InternalInvite {
 >     queryId: uint64
 >     version: uint10
 >     sender: address
 >     invitor: address
 >     currentWalletCode: cell
 >     currentStorage: cell?
 >     id: string
 > }
 */
export interface InternalInvite {
    readonly $: 'InternalInvite'
    queryId: uint64 /* = 0 */
    version: uint10
    sender: c.Address
    invitor: c.Address
    currentWalletCode: c.Cell
    currentStorage: c.Cell | null
    id: string
}

export const InternalInvite = {
    PREFIX: 0x00000001,

    create(args: {
        queryId?: uint64 /* = 0 */
        version: uint10
        sender: c.Address
        invitor: c.Address
        currentWalletCode: c.Cell
        currentStorage: c.Cell | null
        id: string
    }): InternalInvite {
        return {
            $: 'InternalInvite',
            queryId: 0n,
            ...args
        }
    },
    fromSlice(s: c.Slice): InternalInvite {
        loadAndCheckPrefix32(s, 0x00000001, 'InternalInvite');
        return {
            $: 'InternalInvite',
            queryId: s.loadUintBig(64),
            version: s.loadUintBig(10),
            sender: s.loadAddress(),
            invitor: s.loadAddress(),
            currentWalletCode: s.loadRef(),
            currentStorage: s.loadBoolean() ? s.loadRef() : null,
            id: s.loadStringRefTail(),
        }
    },
    store(self: InternalInvite, b: c.Builder): void {
        b.storeUint(0x00000001, 32);
        b.storeUint(self.queryId, 64);
        b.storeUint(self.version, 10);
        b.storeAddress(self.sender);
        b.storeAddress(self.invitor);
        b.storeRef(self.currentWalletCode);
        storeTolkNullable<c.Cell>(self.currentStorage, b,
            (v,b) => b.storeRef(v)
        );
        b.storeStringRefTail(self.id);
    },
    toCell(self: InternalInvite): c.Cell {
        return makeCellFrom<InternalInvite>(self, InternalInvite.store);
    }
}

/**
 > struct (0x00000002) InternalDeActivate {
 > }
 */
export interface InternalDeActivate {
    readonly $: 'InternalDeActivate'
}

export const InternalDeActivate = {
    PREFIX: 0x00000002,

    create(): InternalDeActivate {
        return {
            $: 'InternalDeActivate',
        }
    },
    fromSlice(s: c.Slice): InternalDeActivate {
        loadAndCheckPrefix32(s, 0x00000002, 'InternalDeActivate');
        return {
            $: 'InternalDeActivate',
        }
    },
    store(self: InternalDeActivate, b: c.Builder): void {
        b.storeUint(0x00000002, 32);
    },
    toCell(self: InternalDeActivate): c.Cell {
        return makeCellFrom<InternalDeActivate>(self, InternalDeActivate.store);
    }
}

/**
 > struct (0x00000038) RequestUpgradeCode {
 >     sender: address
 >     version: uint10
 > }
 */
export interface RequestUpgradeCode {
    readonly $: 'RequestUpgradeCode'
    sender: c.Address
    version: uint10
}

export const RequestUpgradeCode = {
    PREFIX: 0x00000038,

    create(args: {
        sender: c.Address
        version: uint10
    }): RequestUpgradeCode {
        return {
            $: 'RequestUpgradeCode',
            ...args
        }
    },
    fromSlice(s: c.Slice): RequestUpgradeCode {
        loadAndCheckPrefix32(s, 0x00000038, 'RequestUpgradeCode');
        return {
            $: 'RequestUpgradeCode',
            sender: s.loadAddress(),
            version: s.loadUintBig(10),
        }
    },
    store(self: RequestUpgradeCode, b: c.Builder): void {
        b.storeUint(0x00000038, 32);
        b.storeAddress(self.sender);
        b.storeUint(self.version, 10);
    },
    toCell(self: RequestUpgradeCode): c.Cell {
        return makeCellFrom<RequestUpgradeCode>(self, RequestUpgradeCode.store);
    }
}

/**
 > struct (0x00000004) InformMinterInviteInternal {
 >     queryId: uint64
 >     sender: address
 >     invitor: address
 >     id: string
 > }
 */
export interface InformMinterInviteInternal {
    readonly $: 'InformMinterInviteInternal'
    queryId: uint64
    sender: c.Address
    invitor: c.Address
    id: string
}

export const InformMinterInviteInternal = {
    PREFIX: 0x00000004,

    create(args: {
        queryId: uint64
        sender: c.Address
        invitor: c.Address
        id: string
    }): InformMinterInviteInternal {
        return {
            $: 'InformMinterInviteInternal',
            ...args
        }
    },
    fromSlice(s: c.Slice): InformMinterInviteInternal {
        loadAndCheckPrefix32(s, 0x00000004, 'InformMinterInviteInternal');
        return {
            $: 'InformMinterInviteInternal',
            queryId: s.loadUintBig(64),
            sender: s.loadAddress(),
            invitor: s.loadAddress(),
            id: s.loadStringRefTail(),
        }
    },
    store(self: InformMinterInviteInternal, b: c.Builder): void {
        b.storeUint(0x00000004, 32);
        b.storeUint(self.queryId, 64);
        b.storeAddress(self.sender);
        b.storeAddress(self.invitor);
        b.storeStringRefTail(self.id);
    },
    toCell(self: InformMinterInviteInternal): c.Cell {
        return makeCellFrom<InformMinterInviteInternal>(self, InformMinterInviteInternal.store);
    }
}

/**
 > struct (0x00000005) AuthorityAction {
 >     sender: address
 > }
 */
export interface AuthorityAction {
    readonly $: 'AuthorityAction'
    sender: c.Address
}

export const AuthorityAction = {
    PREFIX: 0x00000005,

    create(args: {
        sender: c.Address
    }): AuthorityAction {
        return {
            $: 'AuthorityAction',
            ...args
        }
    },
    fromSlice(s: c.Slice): AuthorityAction {
        loadAndCheckPrefix32(s, 0x00000005, 'AuthorityAction');
        return {
            $: 'AuthorityAction',
            sender: s.loadAddress(),
        }
    },
    store(self: AuthorityAction, b: c.Builder): void {
        b.storeUint(0x00000005, 32);
        b.storeAddress(self.sender);
    },
    toCell(self: AuthorityAction): c.Cell {
        return makeCellFrom<AuthorityAction>(self, AuthorityAction.store);
    }
}

/**
 > struct (0x00000006) SetStatus {
 >     sender: address
 >     status: uint2
 > }
 */
export interface SetStatus {
    readonly $: 'SetStatus'
    sender: c.Address
    status: uint2
}

export const SetStatus = {
    PREFIX: 0x00000006,

    create(args: {
        sender: c.Address
        status: uint2
    }): SetStatus {
        return {
            $: 'SetStatus',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetStatus {
        loadAndCheckPrefix32(s, 0x00000006, 'SetStatus');
        return {
            $: 'SetStatus',
            sender: s.loadAddress(),
            status: s.loadUintBig(2),
        }
    },
    store(self: SetStatus, b: c.Builder): void {
        b.storeUint(0x00000006, 32);
        b.storeAddress(self.sender);
        b.storeUint(self.status, 2);
    },
    toCell(self: SetStatus): c.Cell {
        return makeCellFrom<SetStatus>(self, SetStatus.store);
    }
}

/**
 > struct (0x00000008) VotingAction {
 >     positiveVote: bool
 >     count: uint4
 >     sender: address
 > }
 */
export interface VotingAction {
    readonly $: 'VotingAction'
    positiveVote: boolean /* = true */
    count: uint4 /* = 10 */
    sender: c.Address
}

export const VotingAction = {
    PREFIX: 0x00000008,

    create(args: {
        positiveVote?: boolean /* = true */
        count?: uint4 /* = 10 */
        sender: c.Address
    }): VotingAction {
        return {
            $: 'VotingAction',
            positiveVote: true,
            count: 10n,
            ...args
        }
    },
    fromSlice(s: c.Slice): VotingAction {
        loadAndCheckPrefix32(s, 0x00000008, 'VotingAction');
        return {
            $: 'VotingAction',
            positiveVote: s.loadBoolean(),
            count: s.loadUintBig(4),
            sender: s.loadAddress(),
        }
    },
    store(self: VotingAction, b: c.Builder): void {
        b.storeUint(0x00000008, 32);
        b.storeBit(self.positiveVote);
        b.storeUint(self.count, 4);
        b.storeAddress(self.sender);
    },
    toCell(self: VotingAction): c.Cell {
        return makeCellFrom<VotingAction>(self, VotingAction.store);
    }
}

/**
 > struct (0x00000009) Payback {
 >     queryId: uint64
 >     amount: coins
 >     sender: address
 > }
 */
export interface Payback {
    readonly $: 'Payback'
    queryId: uint64
    amount: coins
    sender: c.Address
}

export const Payback = {
    PREFIX: 0x00000009,

    create(args: {
        queryId: uint64
        amount: coins
        sender: c.Address
    }): Payback {
        return {
            $: 'Payback',
            ...args
        }
    },
    fromSlice(s: c.Slice): Payback {
        loadAndCheckPrefix32(s, 0x00000009, 'Payback');
        return {
            $: 'Payback',
            queryId: s.loadUintBig(64),
            amount: s.loadCoins(),
            sender: s.loadAddress(),
        }
    },
    store(self: Payback, b: c.Builder): void {
        b.storeUint(0x00000009, 32);
        b.storeUint(self.queryId, 64);
        b.storeCoins(self.amount);
        b.storeAddress(self.sender);
    },
    toCell(self: Payback): c.Cell {
        return makeCellFrom<Payback>(self, Payback.store);
    }
}

/**
 > struct (0x00000014) Destroy {
 > }
 */
export interface Destroy {
    readonly $: 'Destroy'
}

export const Destroy = {
    PREFIX: 0x00000014,

    create(): Destroy {
        return {
            $: 'Destroy',
        }
    },
    fromSlice(s: c.Slice): Destroy {
        loadAndCheckPrefix32(s, 0x00000014, 'Destroy');
        return {
            $: 'Destroy',
        }
    },
    store(self: Destroy, b: c.Builder): void {
        b.storeUint(0x00000014, 32);
    },
    toCell(self: Destroy): c.Cell {
        return makeCellFrom<Destroy>(self, Destroy.store);
    }
}

/**
 > struct (0x00000022) OthersActions {
 >     queryId: uint64
 >     jettonAmount: coins
 >     transferRecipient: address
 >     sendExcessesTo: address?
 >     customPayload: cell?
 >     forwardTonAmount: coins
 >     forwardPayload: string
 > }
 */
export interface OthersActions {
    readonly $: 'OthersActions'
    queryId: uint64
    jettonAmount: coins
    transferRecipient: c.Address
    sendExcessesTo: c.Address | null
    customPayload: c.Cell | null
    forwardTonAmount: coins
    forwardPayload: string
}

export const OthersActions = {
    PREFIX: 0x00000022,

    create(args: {
        queryId: uint64
        jettonAmount: coins
        transferRecipient: c.Address
        sendExcessesTo: c.Address | null
        customPayload: c.Cell | null
        forwardTonAmount: coins
        forwardPayload: string
    }): OthersActions {
        return {
            $: 'OthersActions',
            ...args
        }
    },
    fromSlice(s: c.Slice): OthersActions {
        loadAndCheckPrefix32(s, 0x00000022, 'OthersActions');
        return {
            $: 'OthersActions',
            queryId: s.loadUintBig(64),
            jettonAmount: s.loadCoins(),
            transferRecipient: s.loadAddress(),
            sendExcessesTo: s.loadMaybeAddress(),
            customPayload: s.loadBoolean() ? s.loadRef() : null,
            forwardTonAmount: s.loadCoins(),
            forwardPayload: s.loadStringRefTail(),
        }
    },
    store(self: OthersActions, b: c.Builder): void {
        b.storeUint(0x00000022, 32);
        b.storeUint(self.queryId, 64);
        b.storeCoins(self.jettonAmount);
        b.storeAddress(self.transferRecipient);
        b.storeAddress(self.sendExcessesTo);
        storeTolkNullable<c.Cell>(self.customPayload, b,
            (v,b) => b.storeRef(v)
        );
        b.storeCoins(self.forwardTonAmount);
        b.storeStringRefTail(self.forwardPayload);
    },
    toCell(self: OthersActions): c.Cell {
        return makeCellFrom<OthersActions>(self, OthersActions.store);
    }
}

/**
 > struct (0x00000015) UnFollow {
 >     queryId: uint64
 >     follow: bool
 >     followee: address
 > }
 */
export interface UnFollow {
    readonly $: 'UnFollow'
    queryId: uint64
    follow: boolean
    followee: c.Address
}

export const UnFollow = {
    PREFIX: 0x00000015,

    create(args: {
        queryId: uint64
        follow: boolean
        followee: c.Address
    }): UnFollow {
        return {
            $: 'UnFollow',
            ...args
        }
    },
    fromSlice(s: c.Slice): UnFollow {
        loadAndCheckPrefix32(s, 0x00000015, 'UnFollow');
        return {
            $: 'UnFollow',
            queryId: s.loadUintBig(64),
            follow: s.loadBoolean(),
            followee: s.loadAddress(),
        }
    },
    store(self: UnFollow, b: c.Builder): void {
        b.storeUint(0x00000015, 32);
        b.storeUint(self.queryId, 64);
        b.storeBit(self.follow);
        b.storeAddress(self.followee);
    },
    toCell(self: UnFollow): c.Cell {
        return makeCellFrom<UnFollow>(self, UnFollow.store);
    }
}

/**
 > struct (0x00000016) UnFollowInternal {
 >     queryId: uint64
 >     follow: bool
 >     sender: address
 > }
 */
export interface UnFollowInternal {
    readonly $: 'UnFollowInternal'
    queryId: uint64
    follow: boolean
    sender: c.Address
}

export const UnFollowInternal = {
    PREFIX: 0x00000016,

    create(args: {
        queryId: uint64
        follow: boolean
        sender: c.Address
    }): UnFollowInternal {
        return {
            $: 'UnFollowInternal',
            ...args
        }
    },
    fromSlice(s: c.Slice): UnFollowInternal {
        loadAndCheckPrefix32(s, 0x00000016, 'UnFollowInternal');
        return {
            $: 'UnFollowInternal',
            queryId: s.loadUintBig(64),
            follow: s.loadBoolean(),
            sender: s.loadAddress(),
        }
    },
    store(self: UnFollowInternal, b: c.Builder): void {
        b.storeUint(0x00000016, 32);
        b.storeUint(self.queryId, 64);
        b.storeBit(self.follow);
        b.storeAddress(self.sender);
    },
    toCell(self: UnFollowInternal): c.Cell {
        return makeCellFrom<UnFollowInternal>(self, UnFollowInternal.store);
    }
}

/**
 > struct (0x11111111) EnterLottery {
 >     sender: address
 >     amount: coins
 > }
 */
export interface EnterLottery {
    readonly $: 'EnterLottery'
    sender: c.Address
    amount: coins
}

export const EnterLottery = {
    PREFIX: 0x11111111,

    create(args: {
        sender: c.Address
        amount: coins
    }): EnterLottery {
        return {
            $: 'EnterLottery',
            ...args
        }
    },
    fromSlice(s: c.Slice): EnterLottery {
        loadAndCheckPrefix32(s, 0x11111111, 'EnterLottery');
        return {
            $: 'EnterLottery',
            sender: s.loadAddress(),
            amount: s.loadCoins(),
        }
    },
    store(self: EnterLottery, b: c.Builder): void {
        b.storeUint(0x11111111, 32);
        b.storeAddress(self.sender);
        b.storeCoins(self.amount);
    },
    toCell(self: EnterLottery): c.Cell {
        return makeCellFrom<EnterLottery>(self, EnterLottery.store);
    }
}

/**
 > struct NomInAddrs {
 >     nominee: address?
 >     invitor: address?
 >     invitor0: address?
 > }
 */
export interface NomInAddrs {
    readonly $: 'NomInAddrs'
    nominee: c.Address | null /* = null */
    invitor: c.Address | null /* = null */
    invitor0: c.Address | null /* = null */
}

export const NomInAddrs = {
    create(args: {
        nominee?: c.Address | null /* = null */
        invitor?: c.Address | null /* = null */
        invitor0?: c.Address | null /* = null */
    }): NomInAddrs {
        return {
            $: 'NomInAddrs',
            nominee: null,
            invitor: null,
            invitor0: null,
            ...args
        }
    },
    fromSlice(s: c.Slice): NomInAddrs {
        return {
            $: 'NomInAddrs',
            nominee: s.loadMaybeAddress(),
            invitor: s.loadMaybeAddress(),
            invitor0: s.loadMaybeAddress(),
        }
    },
    store(self: NomInAddrs, b: c.Builder): void {
        b.storeAddress(self.nominee);
        b.storeAddress(self.invitor);
        b.storeAddress(self.invitor0);
    },
    toCell(self: NomInAddrs): c.Cell {
        return makeCellFrom<NomInAddrs>(self, NomInAddrs.store);
    }
}

/**
 > struct TrustedAddrs {
 >     minterAddr: address
 >     personalJettonMinter: address?
 >     personalJettonWallet: address?
 >     authorisedAccs: map<address, address>
 > }
 */
export interface TrustedAddrs {
    readonly $: 'TrustedAddrs'
    minterAddr: c.Address
    personalJettonMinter: c.Address | null /* = null */
    personalJettonWallet: c.Address | null /* = null */
    authorisedAccs: c.Dictionary<c.Address, c.Address>
}

export const TrustedAddrs = {
    create(args: {
        minterAddr: c.Address
        personalJettonMinter?: c.Address | null /* = null */
        personalJettonWallet?: c.Address | null /* = null */
        authorisedAccs: c.Dictionary<c.Address, c.Address>
    }): TrustedAddrs {
        return {
            $: 'TrustedAddrs',
            personalJettonMinter: null,
            personalJettonWallet: null,
            ...args
        }
    },
    fromSlice(s: c.Slice): TrustedAddrs {
        return {
            $: 'TrustedAddrs',
            minterAddr: s.loadAddress(),
            personalJettonMinter: s.loadMaybeAddress(),
            personalJettonWallet: s.loadMaybeAddress(),
            authorisedAccs: c.Dictionary.load<c.Address, c.Address>(c.Dictionary.Keys.Address(), createDictionaryValue<c.Address>(
                (s) => s.loadAddress(),
                (v,b) => b.storeAddress(v)
            ), s),
        }
    },
    store(self: TrustedAddrs, b: c.Builder): void {
        b.storeAddress(self.minterAddr);
        b.storeAddress(self.personalJettonMinter);
        b.storeAddress(self.personalJettonWallet);
        b.storeDict<c.Address, c.Address>(self.authorisedAccs, c.Dictionary.Keys.Address(), createDictionaryValue<c.Address>(
            (s) => s.loadAddress(),
            (v,b) => b.storeAddress(v)
        ));
    },
    toCell(self: TrustedAddrs): c.Cell {
        return makeCellFrom<TrustedAddrs>(self, TrustedAddrs.store);
    }
}

/**
 > struct Addresses {
 >     owner: address
 >     treasury: address
 >     nomInAddrs: Cell<NomInAddrs>
 >     trustedJettonAddrs: Cell<TrustedAddrs>
 > }
 */
export interface Addresses {
    readonly $: 'Addresses'
    owner: c.Address
    treasury: c.Address
    nomInAddrs: CellRef<NomInAddrs>
    trustedJettonAddrs: CellRef<TrustedAddrs>
}

export const Addresses = {
    create(args: {
        owner: c.Address
        treasury: c.Address
        nomInAddrs: CellRef<NomInAddrs>
        trustedJettonAddrs: CellRef<TrustedAddrs>
    }): Addresses {
        return {
            $: 'Addresses',
            ...args
        }
    },
    fromSlice(s: c.Slice): Addresses {
        return {
            $: 'Addresses',
            owner: s.loadAddress(),
            treasury: s.loadAddress(),
            nomInAddrs: loadCellRef<NomInAddrs>(s, NomInAddrs.fromSlice),
            trustedJettonAddrs: loadCellRef<TrustedAddrs>(s, TrustedAddrs.fromSlice),
        }
    },
    store(self: Addresses, b: c.Builder): void {
        b.storeAddress(self.owner);
        b.storeAddress(self.treasury);
        storeCellRef<NomInAddrs>(self.nomInAddrs, b, NomInAddrs.store);
        storeCellRef<TrustedAddrs>(self.trustedJettonAddrs, b, TrustedAddrs.store);
    },
    toCell(self: Addresses): c.Cell {
        return makeCellFrom<Addresses>(self, Addresses.store);
    }
}

/**
 > struct Maps {
 >     invited: map<address, coins>
 >     allowances: map<address, coins>
 >     votedFor: map<address, uint4>
 >     reportInfo: Cell<ReportInfo>
 > }
 */
export interface Maps {
    readonly $: 'Maps'
    invited: c.Dictionary<c.Address, coins>
    allowances: c.Dictionary<c.Address, coins>
    votedFor: c.Dictionary<c.Address, uint4>
    reportInfo: CellRef<ReportInfo>
}

export const Maps = {
    create(args: {
        invited: c.Dictionary<c.Address, coins>
        allowances: c.Dictionary<c.Address, coins>
        votedFor: c.Dictionary<c.Address, uint4>
        reportInfo: CellRef<ReportInfo>
    }): Maps {
        return {
            $: 'Maps',
            ...args
        }
    },
    fromSlice(s: c.Slice): Maps {
        return {
            $: 'Maps',
            invited: c.Dictionary.load<c.Address, coins>(c.Dictionary.Keys.Address(), c.Dictionary.Values.BigVarUint(4), s),
            allowances: c.Dictionary.load<c.Address, coins>(c.Dictionary.Keys.Address(), c.Dictionary.Values.BigVarUint(4), s),
            votedFor: c.Dictionary.load<c.Address, uint4>(c.Dictionary.Keys.Address(), c.Dictionary.Values.BigUint(4), s),
            reportInfo: loadCellRef<ReportInfo>(s, ReportInfo.fromSlice),
        }
    },
    store(self: Maps, b: c.Builder): void {
        b.storeDict<c.Address, coins>(self.invited, c.Dictionary.Keys.Address(), c.Dictionary.Values.BigVarUint(4));
        b.storeDict<c.Address, coins>(self.allowances, c.Dictionary.Keys.Address(), c.Dictionary.Values.BigVarUint(4));
        b.storeDict<c.Address, uint4>(self.votedFor, c.Dictionary.Keys.Address(), c.Dictionary.Values.BigUint(4));
        storeCellRef<ReportInfo>(self.reportInfo, b, ReportInfo.store);
    },
    toCell(self: Maps): c.Cell {
        return makeCellFrom<Maps>(self, Maps.store);
    }
}

/**
 > struct ReportInfo {
 >     reports: map<address, bool>
 >     tosBreach: bool
 >     reporterCount: uint10
 >     disputerCount: uint10
 >     reportResolutionTime: uint32
 > }
 */
export interface ReportInfo {
    readonly $: 'ReportInfo'
    reports: c.Dictionary<c.Address, boolean>
    tosBreach: boolean /* = false */
    reporterCount: uint10 /* = 0 */
    disputerCount: uint10 /* = 0 */
    reportResolutionTime: uint32 /* = 0 */
}

export const ReportInfo = {
    create(args: {
        reports: c.Dictionary<c.Address, boolean>
        tosBreach?: boolean /* = false */
        reporterCount?: uint10 /* = 0 */
        disputerCount?: uint10 /* = 0 */
        reportResolutionTime?: uint32 /* = 0 */
    }): ReportInfo {
        return {
            $: 'ReportInfo',
            tosBreach: false,
            reporterCount: 0n,
            disputerCount: 0n,
            reportResolutionTime: 0n,
            ...args
        }
    },
    fromSlice(s: c.Slice): ReportInfo {
        return {
            $: 'ReportInfo',
            reports: c.Dictionary.load<c.Address, boolean>(c.Dictionary.Keys.Address(), c.Dictionary.Values.Bool(), s),
            tosBreach: s.loadBoolean(),
            reporterCount: s.loadUintBig(10),
            disputerCount: s.loadUintBig(10),
            reportResolutionTime: s.loadUintBig(32),
        }
    },
    store(self: ReportInfo, b: c.Builder): void {
        b.storeDict<c.Address, boolean>(self.reports, c.Dictionary.Keys.Address(), c.Dictionary.Values.Bool());
        b.storeBit(self.tosBreach);
        b.storeUint(self.reporterCount, 10);
        b.storeUint(self.disputerCount, 10);
        b.storeUint(self.reportResolutionTime, 32);
    },
    toCell(self: ReportInfo): c.Cell {
        return makeCellFrom<ReportInfo>(self, ReportInfo.store);
    }
}

/**
 > struct TimeStamps {
 >     accountInit: uint32
 >     lastInvite: uint32
 >     lastClaim: uint32
 > }
 */
export interface TimeStamps {
    readonly $: 'TimeStamps'
    accountInit: uint32 /* = 0 */
    lastInvite: uint32 /* = 0 */
    lastClaim: uint32 /* = 0 */
}

export const TimeStamps = {
    create(args: {
        accountInit?: uint32 /* = 0 */
        lastInvite?: uint32 /* = 0 */
        lastClaim?: uint32 /* = 0 */
    }): TimeStamps {
        return {
            $: 'TimeStamps',
            accountInit: 0n,
            lastInvite: 0n,
            lastClaim: 0n,
            ...args
        }
    },
    fromSlice(s: c.Slice): TimeStamps {
        return {
            $: 'TimeStamps',
            accountInit: s.loadUintBig(32),
            lastInvite: s.loadUintBig(32),
            lastClaim: s.loadUintBig(32),
        }
    },
    store(self: TimeStamps, b: c.Builder): void {
        b.storeUint(self.accountInit, 32);
        b.storeUint(self.lastInvite, 32);
        b.storeUint(self.lastClaim, 32);
    },
    toCell(self: TimeStamps): c.Cell {
        return makeCellFrom<TimeStamps>(self, TimeStamps.store);
    }
}

/**
 > struct FiWalletStore {
 >     jettonBalance: coins
 >     goldCoins: uint32
 >     id: string
 >     txnCount: uint8
 >     status: uint2
 >     isAuthorityAccount: bool
 >     creditNeed: coins
 >     accumulatedFees: coins
 >     debt: coins
 >     debts: bool
 >     votes: uint4
 >     receivedVotes: uint20
 >     connections: uint8
 >     active: bool
 >     mintable: bool
 >     version: uint10
 >     storeVersion: uint10
 >     timestamps: Cell<TimeStamps>
 >     addresses: Cell<Addresses>
 >     maps: Cell<Maps>
 > }
 */
export interface FiWalletStore {
    readonly $: 'FiWalletStore'
    jettonBalance: coins /* = 0 */
    goldCoins: uint32 /* = 1 */
    id: string /* = "" */
    txnCount: uint8 /* = 0 */
    status: uint2 /* = 0 */
    isAuthorityAccount: boolean /* = false */
    creditNeed: coins /* = 0 */
    accumulatedFees: coins /* = 0 */
    debt: coins /* = 0 */
    debts: boolean /* = false */
    votes: uint4 /* = 10 */
    receivedVotes: uint20 /* = 0 */
    connections: uint8 /* = 0 */
    active: boolean /* = false */
    mintable: boolean /* = true */
    version: uint10 /* = 0 */
    storeVersion: uint10 /* = 0 */
    timestamps: CellRef<TimeStamps>
    addresses: CellRef<Addresses>
    maps: CellRef<Maps>
}

export const FiWalletStore = {
    create(args: {
        jettonBalance?: coins /* = 0 */
        goldCoins?: uint32 /* = 1 */
        id?: string /* = "" */
        txnCount?: uint8 /* = 0 */
        status?: uint2 /* = 0 */
        isAuthorityAccount?: boolean /* = false */
        creditNeed?: coins /* = 0 */
        accumulatedFees?: coins /* = 0 */
        debt?: coins /* = 0 */
        debts?: boolean /* = false */
        votes?: uint4 /* = 10 */
        receivedVotes?: uint20 /* = 0 */
        connections?: uint8 /* = 0 */
        active?: boolean /* = false */
        mintable?: boolean /* = true */
        version?: uint10 /* = 0 */
        storeVersion?: uint10 /* = 0 */
        timestamps: CellRef<TimeStamps>
        addresses: CellRef<Addresses>
        maps: CellRef<Maps>
    }): FiWalletStore {
        return {
            $: 'FiWalletStore',
            jettonBalance: 0n,
            goldCoins: 1n,
            id: "",
            txnCount: 0n,
            status: 0n,
            isAuthorityAccount: false,
            creditNeed: 0n,
            accumulatedFees: 0n,
            debt: 0n,
            debts: false,
            votes: 10n,
            receivedVotes: 0n,
            connections: 0n,
            active: false,
            mintable: true,
            version: 0n,
            storeVersion: 0n,
            ...args
        }
    },
    fromSlice(s: c.Slice): FiWalletStore {
        return {
            $: 'FiWalletStore',
            jettonBalance: s.loadCoins(),
            goldCoins: s.loadUintBig(32),
            id: s.loadStringRefTail(),
            txnCount: s.loadUintBig(8),
            status: s.loadUintBig(2),
            isAuthorityAccount: s.loadBoolean(),
            creditNeed: s.loadCoins(),
            accumulatedFees: s.loadCoins(),
            debt: s.loadCoins(),
            debts: s.loadBoolean(),
            votes: s.loadUintBig(4),
            receivedVotes: s.loadUintBig(20),
            connections: s.loadUintBig(8),
            active: s.loadBoolean(),
            mintable: s.loadBoolean(),
            version: s.loadUintBig(10),
            storeVersion: s.loadUintBig(10),
            timestamps: loadCellRef<TimeStamps>(s, TimeStamps.fromSlice),
            addresses: loadCellRef<Addresses>(s, Addresses.fromSlice),
            maps: loadCellRef<Maps>(s, Maps.fromSlice),
        }
    },
    store(self: FiWalletStore, b: c.Builder): void {
        b.storeCoins(self.jettonBalance);
        b.storeUint(self.goldCoins, 32);
        b.storeStringRefTail(self.id);
        b.storeUint(self.txnCount, 8);
        b.storeUint(self.status, 2);
        b.storeBit(self.isAuthorityAccount);
        b.storeCoins(self.creditNeed);
        b.storeCoins(self.accumulatedFees);
        b.storeCoins(self.debt);
        b.storeBit(self.debts);
        b.storeUint(self.votes, 4);
        b.storeUint(self.receivedVotes, 20);
        b.storeUint(self.connections, 8);
        b.storeBit(self.active);
        b.storeBit(self.mintable);
        b.storeUint(self.version, 10);
        b.storeUint(self.storeVersion, 10);
        storeCellRef<TimeStamps>(self.timestamps, b, TimeStamps.store);
        storeCellRef<Addresses>(self.addresses, b, Addresses.store);
        storeCellRef<Maps>(self.maps, b, Maps.store);
    },
    toCell(self: FiWalletStore): c.Cell {
        return makeCellFrom<FiWalletStore>(self, FiWalletStore.store);
    }
}

/**
 > struct JettonWalletDataReply {
 >     jettonBalance: coins
 >     ownerAddress: address
 >     minterAddress: address
 >     jettonWalletCode: cell
 > }
 */
export interface JettonWalletDataReply {
    readonly $: 'JettonWalletDataReply'
    jettonBalance: coins
    ownerAddress: c.Address
    minterAddress: c.Address
    jettonWalletCode: c.Cell
}

export const JettonWalletDataReply = {
    create(args: {
        jettonBalance: coins
        ownerAddress: c.Address
        minterAddress: c.Address
        jettonWalletCode: c.Cell
    }): JettonWalletDataReply {
        return {
            $: 'JettonWalletDataReply',
            ...args
        }
    },
    fromSlice(s: c.Slice): JettonWalletDataReply {
        return {
            $: 'JettonWalletDataReply',
            jettonBalance: s.loadCoins(),
            ownerAddress: s.loadAddress(),
            minterAddress: s.loadAddress(),
            jettonWalletCode: s.loadRef(),
        }
    },
    store(self: JettonWalletDataReply, b: c.Builder): void {
        b.storeCoins(self.jettonBalance);
        b.storeAddress(self.ownerAddress);
        b.storeAddress(self.minterAddress);
        b.storeRef(self.jettonWalletCode);
    },
    toCell(self: JettonWalletDataReply): c.Cell {
        return makeCellFrom<JettonWalletDataReply>(self, JettonWalletDataReply.store);
    }
}

// ————————————————————————————————————————————
//    class fossFiWallet
//

interface ExtraSendOptions {
    bounce?: boolean                    // default: false
    sendMode?: SendMode                 // default: SendMode.PAY_GAS_SEPARATELY
    extraCurrencies?: c.ExtraCurrency   // default: empty dict
}

interface DeployedAddrOptions {
    workchain?: number                  // default: 0 (basechain)
    toShard?: { fixedPrefixLength: number; closeTo: c.Address }
    overrideContractCode?: c.Cell
}

function calculateDeployedAddress(code: c.Cell, data: c.Cell, options: DeployedAddrOptions): c.Address {
    const stateInitCell = beginCell().store(c.storeStateInit({
        code,
        data,
        splitDepth: options.toShard?.fixedPrefixLength,
        special: null,
        libraries: null,
    })).endCell();

    let addrHash = stateInitCell.hash();
    if (options.toShard) {
        const shardDepth = options.toShard.fixedPrefixLength;
        addrHash = beginCell()
            .storeBits(new c.BitString(options.toShard.closeTo.hash, 0, shardDepth))
            .storeBits(new c.BitString(stateInitCell.hash(), shardDepth, 256 - shardDepth))
            .endCell()
            .beginParse().loadBuffer(32);
    }

    return new c.Address(options.workchain ?? 0, addrHash);
}

export class fossFiWallet implements c.Contract {
    static CodeCell = c.Cell.fromBase64('te6ccgICAX8AAQAAeugAAAEU/wD0pBP0vPLICwABAgFiAAIAAwICxAAEAUYCASAAFwCbAgHVAAUABgH3PiRjnLTHzHtRNBwAtcsIIiIiIyYMDGCElQL5ACOStcsILxqKMyYbBLTPzH6ADCON9csIAAAAAyZMDGCHxdm9boAjiPXLCAAAABEkTCOFmwS1ywgAAAAtDGS8j/hgh8XK1rwAAHiAeLi4gH6AAKgyAH6As7J7VTgIO1E0IAAHA/c7UTQ+gAx0x8x1DHTCjH6ADH6ADH6ADHTIDHSANQx10ztRNDUMdQx10zQ+kgx+kjUMddM0PpI+lAx+lAx9AQx0YiIcMjLX8ltbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJKMj6Uhb6UhTMFMzJbW1tbcj0AHDPCzTJgABgBfQCZA/76ANMf1NMH0wHSAPoA+gD6ANIA0wPTE9MH0gDSANMJ0wnU1NdMAtAB0PpI+kjU10zQJdAC0AXTH9Mf1wsfA/pI+lAG9AT0BPQEDPpQ+lD6UDARIdcsIAAAARTjDwzI+lQBER8B+lQBER0B+lTJAsj6UvpUFc7JAsjLH8sfEssfAAgACQBtAmhXIviSLccF8uBkESHTP/oA+kj6UPQB10wi+kQw8tFN+JeCEB3NZQC88rAjghAGBSNAuuMPAG4ACgNAPw7XLCC8aijMjw/XLCB8U/Us4w8RGhEdERrjDQwRHwwAEQASAHgDYDEighAF9eEAuo8bMDI/LoIQBo53gLrjDxERER0REQwREwwMEREM4w0MER0MDBERDAALAAwADQT+PhEU8uLb+JItxwXy0sTtRNDUMdQx10zQ+kgx+kjUMddM0PpI+lAx+lAx9AQx0YiIcMjLX8ltbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJVhLI+lIW+lIUzBTMyW1tbW3I9ABwzws0yQPI9AAS9AD0AMzJccjLIxXMic8WEwAYAX0AiwCGAzYughAHJw4Auo8MLoIQDbWFgLrjDxET4w0MERMADgAPABAD/jIREND0AfQB9AHXTNBWFPLivvQB0wAx1wsJwQHy4sb4IwmBOECgKbkqgggJOoCgKrmw+JIuxwWx8uLfVhTBC/Lg+hEUpBEgghjomQpGAKCIiHDIy1/JbW1tAsj6VPpU+lTJbW1tLsj6UhP6VPpU9ADJVhTI+lJWEgH6UhLMzMkAGAF9AI4E/D5WEfLivu1E0NQx1DHXTND6SDH6SNQx10zQ+kj6UDH6UDH0BDHRiIhwyMtfyW1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMlWE8j6Uhb6UhTMFMzJbW1tbcj0AHDPCzTJA8j0ABL0APQAzMlxyMsjFcyJzxYTzBLMEszJeAAYAX0AiwCHA+4ughA7i4fAuo9rLoIQGBSNALqO3y6CEDsCM4C6jlEughAuUBRAupo+JG6TNBA8kT3ijjkwDYIQNO3OALqOLfiSyM+FCPpSjQaAAAAAAAAAAAAAAAAAAGqZO22AAAAAAAAAAEDPFsmBAKD7AN7iER3jDREd4w3jDQCIABUAigP+Pu1E0NQx1DHXTND6SDH6SNQx10zQ+kj6UDH6UDH0BDHRiIhwyMtfyW1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMlWE8j6Uhb6UhTMFMzJbW1tbcj0AHDPCzTJA8j0ABL0APQAzMlxyMsjFcyLoAAACgAAAAQAACDPFhPMEgAYAX0AjQL8VyH4kizHBfLgZBEg0z/6APpI+lD0AfoAIPQEAW6RMJHR4iP6RDDy0U34l/iTcPg6I3Jx4wT4OSBugRi3IuMEIW6BHRNYA+MEUCOoJaBzgQMscPg8oAFw+DagAXD4NqBzgQQCghAJZgGAcPg3oLzysHBWIcJklhEhpAERIeMNAJAAFgNa1ywgAAAATI8c1ywgAAAADOMPER0RHxEdER4CER0CAxEQAxxDMOMNERoRHREaABMALQAUA/4+Vx5XHlceDvLS0wnTP9MJ+kj6SNT0BNdM+JLtRNDUMdQx10zQ+kgx+kjUMddM0PpI+lAx+lAx9AQx0YiIcMjLX8ltbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJK8j6Uhb6UhTMFMzJbW1tbcj0AHDPCzTJA8j0ABL0APQAABgBfQCUA/5XIfiSJccF8uK8ESDTP/oA+kgwIVYhufLixREgIaHtRNDUMdQx10zQ+kgx+kjUMddM0PpI+lAx+lAx9AQx0YiIcMjLX8ltbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJVibI+lIW+lIUzBTMyW1tbW3I9ABwzws0yQPI9AASABgBfQCXBP4+VhmRf5f4kivHBcMA4vLivO1E0NQx1DHXTND6SDH6SNQx10zQ+kj6UDH6UDH0BDHRiIhwyMtfyW1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMlWE8j6Uhb6UhTMFMzJbW1tbcj0AHDPCzTJA8j0ABL0APQAzMlxyMsjFcyJABgBfQCLAIwD/lNQoFYlu/KvJaABESQBofgnbxD4l6H4L6BzgQQCghAJZgGAcPg3tgly+wLtRNDUMdQx10zQ+kgx+kjUMddM0PpI+lAx+lAx9AQx0YiIcMjLX8ltbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJKcj6Uhb6UhTMFMzJbW1tbcgAGAF9AJIBRb/YF2omh9AGoY6hjrpmh9JGoY66ZofSR9KBj9KBj6AhjoxEABgBFP8A9KQT9LzyyAsAGQIBYgAaABsCAsQAHQFGAgEgABwAmwFFv9gXaiaH0AahjqGOumaH0kahjrpmh9JH0oGP0oGPoCGOjEQAMwIB1QAeAB8B9z4kY5y0x8x7UTQcALXLCCIiIiMmDAxghJUC+QAjkrXLCC8aijMmGwS0z8x+gAwjjfXLCAAAAAMmTAxgh8XZvW6AI4j1ywgAAAARJEwjhZsEtcsIAAAALQxkvI/4YIfFyta8AAB4gHi4uIB+gACoMgB+gLOye1U4CDtRNCAAIAP3O1E0PoAMdMfMdQx0wox+gAx+gAx+gAx0yAx0gDUMddM7UTQ1DHUMddM0PpIMfpI1DHXTND6SPpQMfpQMfQEMdGIiHDIy1/JbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAySjI+lIW+lIUzBTMyW1tbW3I9ABwzws0yYAAzAX0AmQP++gDTH9TTB9MB0gD6APoA+gDSANMD0xPTB9IA0gDTCdMJ1NTXTALQAdD6SPpI1NdM0CXQAtAF0x/TH9cLHwP6SPpQBvQE9AT0BAz6UPpQ+lAwESHXLCAAAAEU4w8MyPpUAREfAfpUAREdAfpUyQLI+lL6VBXOyQLIyx/LHxLLHwAhACIAbQJoVyL4ki3HBfLgZBEh0z/6APpI+lD0AddMIvpEMPLRTfiXghAdzWUAvPKwI4IQBgUjQLrjDwBuACMDQD8O1ywgvGoozI8P1ywgfFP1LOMPERoRHREa4w0MER8MACoAKwB4A2AxIoIQBfXhALqPGzAyPy6CEAaOd4C64w8REREdEREMERMMDBERDOMNDBEdDAwREQwAJAAlACYE/j4RFPLi2/iSLccF8tLE7UTQ1DHUMddM0PpIMfpI1DHXTND6SPpQMfpQMfQEMdGIiHDIy1/JbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyVYSyPpSFvpSFMwUzMltbW1tyPQAcM8LNMkDyPQAEvQA9ADMyXHIyyMVzInPFhMAMwF9AIsAhgM2LoIQBycOALqPDC6CEA21hYC64w8RE+MNDBETACcAKAApA/4yERDQ9AH0AfQB10zQVhTy4r70AdMAMdcLCcEB8uLG+CMJgThAoCm5KoIICTqAoCq5sPiSLscFsfLi31YUwQvy4PoRFKQRIIIY6JkKRgCgiIhwyMtfyW1tbQLI+lT6VPpUyW1tbS7I+lIT+lT6VPQAyVYUyPpSVhIB+lISzMzJADMBfQCOBPw+VhHy4r7tRNDUMdQx10zQ+kgx+kjUMddM0PpI+lAx+lAx9AQx0YiIcMjLX8ltbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJVhPI+lIW+lIUzBTMyW1tbW3I9ABwzws0yQPI9AAS9AD0AMzJccjLIxXMic8WE8wSzBLMyXgAMwF9AIsAhwPuLoIQO4uHwLqPay6CEBgUjQC6jt8ughA7AjOAuo5RLoIQLlAUQLqaPiRukzQQPJE94o45MA2CEDTtzgC6ji34ksjPhQj6Uo0GgAAAAAAAAAAAAAAAAABqmTttgAAAAAAAAABAzxbJgQCg+wDe4hEd4w0RHeMN4w0AiAAxAIoD/j7tRNDUMdQx10zQ+kgx+kjUMddM0PpI+lAx+lAx9AQx0YiIcMjLX8ltbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJVhPI+lIW+lIUzBTMyW1tbW3I9ABwzws0yQPI9AAS9AD0AMzJccjLIxXMi6AAAAoAAAAEAAAgzxYTzBIAMwF9AI0C/Fch+JIsxwXy4GQRINM/+gD6SPpQ9AH6ACD0BAFukTCR0eIj+kQw8tFN+Jf4k3D4OiNyceME+DkgboEYtyLjBCFugR0TWAPjBFAjqCWgc4EDLHD4PKABcPg2oAFw+Dagc4EEAoIQCWYBgHD4N6C88rBwViHCZJYRIaQBESHjDQCQADIDWtcsIAAAAEyPHNcsIAAAAAzjDxEdER8RHREeAhEdAgMREAMcQzDjDREaER0RGgAsAC0ALgP+PlceVx5XHg7y0tMJ0z/TCfpI+kjU9ATXTPiS7UTQ1DHUMddM0PpIMfpI1DHXTND6SPpQMfpQMfQEMdGIiHDIy1/JbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAySvI+lIW+lIUzBTMyW1tbW3I9ABwzws0yQPI9AAS9AD0AAAzAX0AlAT81ywgAAAAFI9z1ywgAAAALI7o1ywgAAAANJxXG1cgERn6SDHXCwGOzdcsIAAAAcSOQFchESD6SDD4kgHwAfiSghAF9eEAbfgqyM+QlCNZq1YTzwsJUvD6UhL0APQAycjPhQgT+lIB+gJxzwtqzMlz+wDjDhEZ4hEZERDjDeMNAC8AfQB+AH8D/lch+JIlxwXy4rwRINM/+gD6SDAhViG58uLFESAhoe1E0NQx1DHXTND6SDH6SNQx10zQ+kj6UDH6UDH0BDHRiIhwyMtfyW1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMlWJsj6Uhb6UhTMFMzJbW1tbcj0AHDPCzTJA8j0ABIAMwF9AJcD5tcsIShGs1SPaNcsIAAAAESO29csIsr4PeSaXw9fD18EhA/y8ODXLCabkKxkjjswVyAmkXCX+JIlxwXDAOKOKTY7PlcVVxp/ERmCEDuaygCgf/gj+Cj4KBEeBBEdBAMRGAMEERAERsQC3uMOERLjDRES4w0AgAAwAIIAalchESDSANMD+kgw+JIB8AEBlQEREwGglQEREwGh4lOpxwWOEFcYVheCCA9CQLx/cOMEERjfBP4+VhmRf5f4kivHBcMA4vLivO1E0NQx1DHXTND6SDH6SNQx10zQ+kj6UDH6UDH0BDHRiIhwyMtfyW1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMlWE8j6Uhb6UhTMFMzJbW1tbcj0AHDPCzTJA8j0ABL0APQAzMlxyMsjFcyJADMBfQCLAIwD/lNQoFYlu/KvJaABESQBofgnbxD4l6H4L6BzgQQCghAJZgGAcPg3tgly+wLtRNDUMdQx10zQ+kgx+kjUMddM0PpI+lAx+lAx9AQx0YiIcMjLX8ltbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJKcj6Uhb6UhTMFMzJbW1tbcgAMwF9AJIBFP8A9KQT9LzyyAsANAIBYgA1ADYCAsQANwFGAgEgAEoAmwIB1QA4ADkB9z4kY5y0x8x7UTQcALXLCCIiIiMmDAxghJUC+QAjkrXLCC8aijMmGwS0z8x+gAwjjfXLCAAAAAMmTAxgh8XZvW6AI4j1ywgAAAARJEwjhZsEtcsIAAAALQxkvI/4YIfFyta8AAB4gHi4uIB+gACoMgB+gLOye1U4CDtRNCAAOgP3O1E0PoAMdMfMdQx0wox+gAx+gAx+gAx0yAx0gDUMddM7UTQ1DHUMddM0PpIMfpI1DHXTND6SPpQMfpQMfQEMdGIiHDIy1/JbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAySjI+lIW+lIUzBTMyW1tbW3I9ABwzws0yYABLAX0AmQP++gDTH9TTB9MB0gD6APoA+gDSANMD0xPTB9IA0gDTCdMJ1NTXTALQAdD6SPpI1NdM0CXQAtAF0x/TH9cLHwP6SPpQBvQE9AT0BAz6UPpQ+lAwESHXLCAAAAEU4w8MyPpUAREfAfpUAREdAfpUyQLI+lL6VBXOyQLIyx/LHxLLHwA7ADwAbQJoVyL4ki3HBfLgZBEh0z/6APpI+lD0AddMIvpEMPLRTfiXghAdzWUAvPKwI4IQBgUjQLrjDwBuAD0DQD8O1ywgvGoozI8P1ywgfFP1LOMPERoRHREa4w0MER8MAEQARQB4A2AxIoIQBfXhALqPGzAyPy6CEAaOd4C64w8REREdEREMERMMDBERDOMNDBEdDAwREQwAPgA/AEAE/j4RFPLi2/iSLccF8tLE7UTQ1DHUMddM0PpIMfpI1DHXTND6SPpQMfpQMfQEMdGIiHDIy1/JbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyVYSyPpSFvpSFMwUzMltbW1tyPQAcM8LNMkDyPQAEvQA9ADMyXHIyyMVzInPFhMASwF9AIsAhgM2LoIQBycOALqPDC6CEA21hYC64w8RE+MNDBETAEEAQgBDA/4yERDQ9AH0AfQB10zQVhTy4r70AdMAMdcLCcEB8uLG+CMJgThAoCm5KoIICTqAoCq5sPiSLscFsfLi31YUwQry4PoRFKQRIIIY6JkKRgCgiIhwyMtfyW1tbQLI+lT6VPpUyW1tbS7I+lIT+lT6VPQAyVYUyPpSVhIB+lISzMzJAEsBfQCOBPw+VhHy4r7tRNDUMdQx10zQ+kgx+kjUMddM0PpI+lAx+lAx9AQx0YiIcMjLX8ltbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJVhPI+lIW+lIUzBTMyW1tbW3I9ABwzws0yQPI9AAS9AD0AMzJccjLIxXMic8WE8wSzBLMyXgASwF9AIsAhwPuLoIQO4uHwLqPay6CEBgUjQC6jt8ughA7AjOAuo5RLoIQLlAUQLqaPiRukzQQPJE94o45MA2CEDTtzgC6ji34ksjPhQj6Uo0GgAAAAAAAAAAAAAAAAABqmTttgAAAAAAAAABAzxbJgQCg+wDe4hEd4w0RHeMN4w0AiABIAIoD/j7tRNDUMdQx10zQ+kgx+kjUMddM0PpI+lAx+lAx9AQx0YiIcMjLX8ltbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJVhPI+lIW+lIUzBTMyW1tbW3I9ABwzws0yQPI9AAS9AD0AMzJccjLIxXMi6AAAAoAAAAEAAAgzxYTzBIASwF9AI0C/Fch+JIsxwXy4GQRINM/+gD6SPpQ9AH6ACD0BAFukTCR0eIj+kQw8tFN+Jf4k3D4OiNyceME+DkgboEYtyLjBCFugR0TWAPjBFAjqCWgc4EDLHD4PKABcPg2oAFw+Dagc4EEAoIQCWYBgHD4N6C88rBwViHCZJYRIaQBESHjDQCQAEkDWtcsIAAAAEyPHNcsIAAAAAzjDxEdER8RHREeAhEdAgMREAMcQzDjDREaER0RGgBGAHoARwP+PlceVx5XHg7y0tMJ0z/TCfpI+kjU9ATXTPiS7UTQ1DHUMddM0PpIMfpI1DHXTND6SPpQMfpQMfQEMdGIiHDIy1/JbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAySvI+lIW+lIUzBTMyW1tbW3I9ABwzws0yQPI9AAS9AD0AABLAX0AlAP+VyH4kiXHBfLivBEg0z/6APpIMCFWIbny4sURICGh7UTQ1DHUMddM0PpIMfpI1DHXTND6SPpQMfpQMfQEMdGIiHDIy1/JbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyVYmyPpSFvpSFMwUzMltbW1tyPQAcM8LNMkDyPQAEgBLAX0AlwT+PlYZkX+X+JIrxwXDAOLy4rztRNDUMdQx10zQ+kgx+kjUMddM0PpI+lAx+lAx9AQx0YiIcMjLX8ltbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJVhPI+lIW+lIUzBTMyW1tbW3I9ABwzws0yQPI9AAS9AD0AMzJccjLIxXMiQBLAX0AiwCMA/5TUKBWJbvyryWgAREkAaH4J28Q+Jeh+C+gc4EEAoIQCWYBgHD4N7YJcvsC7UTQ1DHUMddM0PpIMfpI1DHXTND6SPpQMfpQMfQEMdGIiHDIy1/JbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAySnI+lIW+lIUzBTMyW1tbW3IAEsBfQCSAUW/2BdqJofQBqGOoY66ZofSRqGOumaH0kfSgY/SgY+gIY6MRABLART/APSkE/S88sgLAEwCAWIATQBOAgLEAFABRgIBIABPAJsBRb/YF2omh9AGoY6hjrpmh9JGoY66ZofSR9KBj9KBj6AhjoxEAGMCAdUAUQBSAfc+JGOctMfMe1E0HAC1ywgiIiIjJgwMYISVAvkAI5K1ywgvGoozJhsEtM/MfoAMI431ywgAAAADJkwMYIfF2b1ugCOI9csIAAAAESRMI4WbBLXLCAAAAC0MZLyP+GCHxcrWvAAAeIB4uLiAfoAAqDIAfoCzsntVOAg7UTQgAFMD9ztRND6ADHTHzHUMdMKMfoAMfoAMfoAMdMgMdIA1DHXTO1E0NQx1DHXTND6SDH6SNQx10zQ+kj6UDH6UDH0BDHRiIhwyMtfyW1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMkoyPpSFvpSFMwUzMltbW1tyPQAcM8LNMmAAYwF9AJkD/voA0x/U0wfTAdIA+gD6APoA0gDTA9MT0wfSANIA0wnTCdTU10wC0AHQ+kj6SNTXTNAl0ALQBdMf0x/XCx8D+kj6UAb0BPQE9AQM+lD6UPpQMBEh1ywgAAABFOMPDMj6VAERHwH6VAERHQH6VMkCyPpS+lQVzskCyMsfyx8Syx8AVABVAG0CaFci+JItxwXy4GQRIdM/+gD6SPpQ9AHXTCL6RDDy0U34l4IQHc1lALzysCOCEAYFI0C64w8AbgBWA0A/DtcsILxqKMyPD9csIHxT9SzjDxEaER0RGuMNDBEfDABdAF4AeANgMSKCEAX14QC6jxswMj8ughAGjneAuuMPERERHRERDBETDAwREQzjDQwRHQwMEREMAFcAWABZBP4+ERTy4tv4ki3HBfLSxO1E0NQx1DHXTND6SDH6SNQx10zQ+kj6UDH6UDH0BDHRiIhwyMtfyW1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMlWEsj6Uhb6UhTMFMzJbW1tbcj0AHDPCzTJA8j0ABL0APQAzMlxyMsjFcyJzxYTAGMBfQCLAIYDNi6CEAcnDgC6jwwughANtYWAuuMPERPjDQwREwBaAFsAXAP+MhEQ0PQB9AH0AddM0FYU8uK+9AHTADHXCwnBAfLixvgjCYE4QKApuSqCCAk6gKAqubD4ki7HBbHy4t9WFMEK8uD6ERSkESCCGOiZCkYAoIiIcMjLX8ltbW0CyPpU+lT6VMltbW0uyPpSE/pU+lT0AMlWFMj6UlYSAfpSEszMyQBjAX0AjgT8PlYR8uK+7UTQ1DHUMddM0PpIMfpI1DHXTND6SPpQMfpQMfQEMdGIiHDIy1/JbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyVYTyPpSFvpSFMwUzMltbW1tyPQAcM8LNMkDyPQAEvQA9ADMyXHIyyMVzInPFhPMEswSzMl4AGMBfQCLAIcD7i6CEDuLh8C6j2sughAYFI0Auo7fLoIQOwIzgLqOUS6CEC5QFEC6mj4kbpM0EDyRPeKOOTANghA07c4Auo4t+JLIz4UI+lKNBoAAAAAAAAAAAAAAAAAAapk7bYAAAAAAAAAAQM8WyYEAoPsA3uIRHeMNER3jDeMNAIgAYQCKA/4+7UTQ1DHUMddM0PpIMfpI1DHXTND6SPpQMfpQMfQEMdGIiHDIy1/JbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyVYTyPpSFvpSFMwUzMltbW1tyPQAcM8LNMkDyPQAEvQA9ADMyXHIyyMVzIugAAAKAAAABAAAIM8WE8wSAGMBfQCNAvxXIfiSLMcF8uBkESDTP/oA+kj6UPQB+gAg9AQBbpEwkdHiI/pEMPLRTfiX+JNw+DojcnHjBPg5IG6BGLci4wQhboEdE1gD4wRQI6gloHOBAyxw+DygAXD4NqABcPg2oHOBBAKCEAlmAYBw+DegvPKwcFYhwmSWESGkAREh4w0AkABiA1rXLCAAAABMjxzXLCAAAAAM4w8RHREfER0RHgIRHQIDERADHEMw4w0RGhEdERoAXwB6AGAD/j5XHlceVx4O8tLTCdM/0wn6SPpI1PQE10z4ku1E0NQx1DHXTND6SDH6SNQx10zQ+kj6UDH6UDH0BDHRiIhwyMtfyW1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMkryPpSFvpSFMwUzMltbW1tyPQAcM8LNMkDyPQAEvQA9AAAYwF9AJQD/lch+JIlxwXy4rwRINM/+gD6SDAhViG58uLFESAhoe1E0NQx1DHXTND6SDH6SNQx10zQ+kj6UDH6UDH0BDHRiIhwyMtfyW1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMlWJsj6Uhb6UhTMFMzJbW1tbcj0AHDPCzTJA8j0ABIAYwF9AJcE/j5WGZF/l/iSK8cFwwDi8uK87UTQ1DHUMddM0PpIMfpI1DHXTND6SPpQMfpQMfQEMdGIiHDIy1/JbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyVYTyPpSFvpSFMwUzMltbW1tyPQAcM8LNMkDyPQAEvQA9ADMyXHIyyMVzIkAYwF9AIsAjAP+U1CgViW78q8loAERJAGh+CdvEPiXofgvoHOBBAKCEAlmAYBw+De2CXL7Au1E0NQx1DHXTND6SDH6SNQx10zQ+kj6UDH6UDH0BDHRiIhwyMtfyW1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMkpyPpSFvpSFMwUzMltbW1tyABjAX0AkgEU/wD0pBP0vPLICwBkAgFiAGUAZgICxABnAUYCASAAmgCbAgHVAGgAaQH3PiRjnLTHzHtRNBwAtcsIIiIiIyYMDGCElQL5ACOStcsILxqKMyYbBLTPzH6ADCON9csIAAAAAyZMDGCHxdm9boAjiPXLCAAAABEkTCOFmwS1ywgAAAAtDGS8j/hgh8XK1rwAAHiAeLi4gH6AAKgyAH6As7J7VTgIO1E0IABqA/c7UTQ+gAx0x8x1DHTCjH6ADH6ADH6ADHTIDHSANQx10ztRNDUMdQx10zQ+kgx+kjUMddM0PpI+lAx+lAx9AQx0YiIcMjLX8ltbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJKMj6Uhb6UhTMFMzJbW1tbcj0AHDPCzTJgAJwBfQCZA/76ANMf1NMH0wHSAPoA+gD6ANIA0wPTE9MH0gDSANMJ0wnU1NdMAtAB0PpI+kjU10zQJdAC0AXTH9Mf1wsfA/pI+lAG9AT0BPQEDPpQ+lD6UDARIdcsIAAAARTjDwzI+lQBER8B+lQBER0B+lTJAsj6UvpUFc7JAsjLH8sfEssfAGsAbABtAmhXIviSLccF8uBkESHTP/oA+kj6UPQB10wi+kQw8tFN+JeCEB3NZQC88rAjghAGBSNAuuMPAG4AbwNAPw7XLCC8aijMjw/XLCB8U/Us4w8RGhEdERrjDQwRHwwAdgB3AHgAqMkEyPpSE/pSzMzJERXI9AABERYB9AAS9ADOycgBERL6AgEREAHLHx7MHMsHGssBGMoAUAb6AlAE+gJY+gLKAMsDyxPLB8oAygDLCcsJE8zMzMntVADeE18DP/gjKYIICTqAoCG58uLfggvCZwAqoCG8nIIICTqAUAugKrnDAJI6cOLy4t+CIAoa+zVGAIIQO5rKAFYWqKARIFYgoMjPke92X3oSyz8BESD6AlLA+lIe+lTJyM+FCFJg+lJxzwtuzMmAUPsAA2AxIoIQBfXhALqPGzAyPy6CEAaOd4C64w8REREdEREMERMMDBERDOMNDBEdDAwREQwAcABxAHIE/j4RFPLi2/iSLccF8tLE7UTQ1DHUMddM0PpIMfpI1DHXTND6SPpQMfpQMfQEMdGIiHDIy1/JbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyVYSyPpSFvpSFMwUzMltbW1tyPQAcM8LNMkDyPQAEvQA9ADMyXHIyyMVzInPFhMAnAF9AIsAhgM2LoIQBycOALqPDC6CEA21hYC64w8RE+MNDBETAHMAdAB1A/4yERDQ9AH0AfQB10zQVhTy4r70AdMAMdcLCcEB8uLG+CMJgThAoCm5KoIICTqAoCq5sPiSLscFsfLi31YUwQry4PoRFKQRIIIY6JkKRgCgiIhwyMtfyW1tbQLI+lT6VPpUyW1tbS7I+lIT+lT6VPQAyVYUyPpSVhIB+lISzMzJAJwBfQCOBPw+VhHy4r7tRNDUMdQx10zQ+kgx+kjUMddM0PpI+lAx+lAx9AQx0YiIcMjLX8ltbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJVhPI+lIW+lIUzBTMyW1tbW3I9ABwzws0yQPI9AAS9AD0AMzJccjLIxXMic8WE8wSzBLMyXgAnAF9AIsAhwPuLoIQO4uHwLqPay6CEBgUjQC6jt8ughA7AjOAuo5RLoIQLlAUQLqaPiRukzQQPJE94o45MA2CEDTtzgC6ji34ksjPhQj6Uo0GgAAAAAAAAAAAAAAAAABqmTttgAAAAAAAAABAzxbJgQCg+wDe4hEd4w0RHeMN4w0AiACJAIoD/j7tRNDUMdQx10zQ+kgx+kjUMddM0PpI+lAx+lAx9AQx0YiIcMjLX8ltbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJVhPI+lIW+lIUzBTMyW1tbW3I9ABwzws0yQPI9AAS9AD0AMzJccjLIxXMi6AAAAoAAAAEAAAgzxYTzBIAnAF9AI0C/Fch+JIsxwXy4GQRINM/+gD6SPpQ9AH6ACD0BAFukTCR0eIj+kQw8tFN+Jf4k3D4OiNyceME+DkgboEYtyLjBCFugR0TWAPjBFAjqCWgc4EDLHD4PKABcPg2oAFw+Dagc4EEAoIQCWYBgHD4N6C88rBwViHCZJYRIaQBESHjDQCQAJEDWtcsIAAAAEyPHNcsIAAAAAzjDxEdER8RHREeAhEdAgMREAMcQzDjDREaER0RGgB5AHoAewL8VyERINM/+gDTCdIA+kj6UPoAMfiSI/ABJFYWupE04w4RIySgAo5WghAF9eEAiwIg1ywFMfKJbYIBhqDIz5BeNRRmKc8LPyj6As+IAMAT+lL6VAH6AiTPFslUdiHIz4UIUuD6UgH6AoIQZCt9B88LihLLP/pSWPoCzMlz+wDeAIQAhQP+PlceVx5XHg7y0tMJ0z/TCfpI+kjU9ATXTPiS7UTQ1DHUMddM0PpIMfpI1DHXTND6SPpQMfpQMfQEMdGIiHDIy1/JbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAySvI+lIW+lIUzBTMyW1tbW3I9ABwzws0yQPI9AAS9AD0AACcAX0AlAT81ywgAAAAFI9z1ywgAAAALI7o1ywgAAAANJxXG1cgERn6SDHXCwGOzdcsIAAAAcSOQFchESD6SDD4kgHwAfiSghAF9eEAbfgqyM+QlCNZq1YTzwsJUvD6UhL0APQAycjPhQgT+lIB+gJxzwtqzMlz+wDjDhEZ4hEZERDjDeMNAHwAfQB+AH8D/lch+JIlxwXy4rwRINM/+gD6SDAhViG58uLFESAhoe1E0NQx1DHXTND6SDH6SNQx10zQ+kj6UDH6UDH0BDHRiIhwyMtfyW1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMlWJsj6Uhb6UhTMFMzJbW1tbcj0AHDPCzTJA8j0ABIAnAF9AJcD3NcsIShGs1SPY9csIAAAAESO0tcsIsr4PeSaXw9fD18EhA/y8ODXLCabkKxkji4wVyAmkXCX+JIlxwXDAOKOHDY7PlcVVxp/f/gj+Cj4KBEeAxEYAwQREARGxALe4w4RGAEREgHjDREYARESAeMNAIAAgQCCAMxXIREg+kgw+JIB8AFWGPLSxBEQs1Ydjk34kov2F1dGhvcml0eUZyZWV6ZYyIvBeNRRkAAAAAAAAAAIzxZWIPoCVhHPCwnPgVLQ+lJS0PpUz4QgzsnIz4WIEvpScc8LbszJgFD7AN4AKjBXIPiSVh/HBfiSLscFsfLi5BEQswAqAREfAREQER4REAERHQECERACA0HMAe7XLCObFoTkjjVXIREg0z/6APpIgggPQkDIz5HNi0JyFcs/UAP6AvpSzsnIz4UIUtD6Ulj6AnHPC2rMyXP7AI621ywgiIiIjI4rVyERIPpI+gAw+JJY8AHIz4WIUmD6UoIQEREREc8LjlLA+lIB+gLJgFD7AOMO4gCDAFZXGlcgERjSANMD+kgw+JIB8AEBlQEREgGglQEREgGh4iCCCA9CQLx/cOMEAFhXIREg0wAx0wn6SPQE9AX4klAD8AFWESO5nlcRIPsE0O0e7VMP8Qiukl8D4gD+1ywgAAAArJswVyD4kivHBfLivI5p1ywgAAAAtJ9XIREg00Ax+kgw+JIB8AGOT9csIAAAAKQxjjdXIPiSK8cF8uK8+JLIz4UI+lKNBoAAAAAAAAAAAAAAAAAAapk7bYAAAAAAAAAAQM8WyYEAoPsAnIQPESHHAAERIQHy9OLi4gDGBFYVuY41+JKCEAX14QBt+CrIz5CUI1mrVhnPCwlWFQH6UhL0APQAycjPhQgT+lIB+gJxzwtqzMlz+wCOJfiSghAF9eEAyM+FCBL6UgH6AoA4zwuKVhEB+lJWFc8LCclz+wDiAN6CCA9CQMjPkc2LQnImzws/UAX6AlIQ+lITzsnIz4UIVhAB+lJQBPoCcc8LahPMyXP7AFYgbrMCESEB4wT4l/gnbxCi+C+gc4EEAoIQCWYBgHD4N7YJcvsCyM+FCPpSghDVMnbbzwuOyz/JgQCC+wAAmswSzBLMyXhRIsjPg8sEz4WgzMz5FoT3sB6AC1AP1yTIz4oAQM4dy/fPUHDIz4agVCAvgQEL9EHIz4UIEvpSgQEazwuTUrD6UsmAUPsAAGZRIsjPg8sEz4WgzMz5FoT3sB+ACwERENckyM+KAEDOHsv3z1DIz4WI+lJyzwuOyYBQ+wAAXDA9ER2CElQL5AChghJUC+QAyM+FiFJg+lKCEBERERHPC45SwPpSAfoCyYBQ+wAE/j5WGZF/l/iSK8cFwwDi8uK87UTQ1DHUMddM0PpIMfpI1DHXTND6SPpQMfpQMfQEMdGIiHDIy1/JbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyVYTyPpSFvpSFMwUzMltbW1tyPQAcM8LNMkDyPQAEvQA9ADMyXHIyyMVzIkAnAF9AIsAjABIMD2CEAX14QDIz4UIUmD6UgH6AoA4zwuKUrD6Ui/PCwnJc/sAABMAAACgAAAAQAACAILPFhPMEswSzMl4USLIz4PLBM+FoMzM+RaE97AfgAsBERDXJMjPigBAzh7L989QK8jPhYgS+lJ1zwuO+lLJgFD7AACizBLMyXhRIsjPg8sEz4WgzMz5FoT3sB+ACwERENckyM+KAEDOHsv3z1BSAoEBC/Ri8uLc0wPRAREVAaDIz4UIEvpSgQEKzwuTUrD6UsmAUPsAAfxtbW1tyPQAcM8LNMkDyPQAEvQA9ADMyXHIyyMUzIugAAAKAAAABAAAIM8WEszMzMl4+CptVhZWE1YpyM+QAAAABhrLPxLLCfpSF/pSzBX0AAERFwHMycjPiYgBVhdTNcjPg8sEz4WgzMz5FoT3sBETgAsm1yQ1FM4BEREBy/cAjwA0gRUNzwt5AREQAcwBERQBzAEREwHMyYBQ+wAAhjBXIHCCGBeEEbIAggiYloDIi8e92X3gAAAAAAAAAAjPFiL6AlYTAfpSUlD6VMnIz4UIUuD6Ulj6AnHPC2rMyYAR+wAD/lNQoFYlu/KvJaABESQBofgnbxD4l6H4L6BzgQQCghAJZgGAcPg3tgly+wLtRNDUMdQx10zQ+kgx+kjUMddM0PpI+lAx+lAx9AQx0YiIcMjLX8ltbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJKcj6Uhb6UhTMFMzJbW1tbcgAnAF9AJIB/vQAcM8LNMkDyPQAEvQA9ADMyXHIyyMVzIugAAAKAAAABAAAIM8WE8wSzBLMyXhRIsjPg8sEz4WgzMz5FoT3sBWAC1AG1yTIz4oAQM4Uy/fPUFYUVhHIz5BeNRRmGMs/UAb6AhXLCc+BFfpS+lRQA/oCAREdAc7JyM+FiAERHQEAkwAi+lJxzwtuAREcAczJgQCQ+wAC/MzJccjLIxXMi6AAAAoAAAAEAAAgzxYTzBLMEszJeChUEjLIz4PLBM+FoMzM+RaE97ASgAtQA9ckyM+KAEDOy/fPUMcF8uK8f4IQO5rKACuUECdsMuMO+JKCCA9CQMjPkAAAABIYyz9S4PpSFfpSFczJyM+FCFJw+lJQBvoCcQCVAJYAZDtXH1cg+CP4klYhJ1YUvI4SVxMj+wQD0O0e7VMB8QiuBBEQlBAnbDLiAREfAREdUAQIABTPC2oVzMmAUPsAAf70APQAzMlxyMsjFcyLoAAACgAAAAQAACDPFhPMEswSzMl4USLIz4PLBM+FoMzM+RaE97ABESIBgAsBESPXJMjPigBAzgERIQHL989QbYsIVhNWEMjPkF41FGYXyz9QBfoCFMsJz4EU+lIT+lTPhCDOycjPhYgS+lJxzwtuzMlyAJgABPsAAOQDyPQAEvQA9ADMyXHIyyMVzIugAAAKAAAABAAAIM8WE8wSzBLMyXhRIsjPg8sEz4WgzMz5FoT3sBSAC1AF1yTIz4oAQM4Ty/fPUCPHBZVsIfLivuAw0PpIMfpIMdQx1NHQ+kj6UDH6UDH0BDHRxwXy4EoBRb/YF2omh9AGoY6hjrpmh9JGoY66ZofSR9KBj9KBj6AhjoxEAJwCAWoAsgCzART/APSkE/S88sgLAJ0CAWIAngCfAgLEAKABRgIBIACxAUACAdUAoQCiAfc+JGOctMfMe1E0HAC1ywgiIiIjJgwMYISVAvkAI5K1ywgvGoozJhsEtM/MfoAMI431ywgAAAADJkwMYIfF2b1ugCOI9csIAAAAESRMI4WbBLXLCAAAAC0MZLyP+GCHxcrWvAAAeIB4uLiAfoAAqDIAfoCzsntVOAg7UTQgAKMEvztRND6ADHTKjH6ADH6ADH6ADHTIDHSANQx10ztRNDUMddM0PpIMfpI1DHUMddM0PpI+lAx+lAx9AQx0YhwyMtfyYhtbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJiIAC2AX0BfQE9A/76ANMf0wfTAdIA+gD6APoA0gDTA9MT0wfSANIA0wnTCdTU10wC0AHQ+kj6SNTU1AHQJ9AD0AfTH9Mf1wsfA/pI+lAH9AT0BPQEDvpQ+lD6UDARItcsIAAAARTjDw7I+lQBESAB+lQBER4B+lTJAsj6UvpUFs7JAsjLH8sfEssfAKQApQDYAqhXI/iSL8cF8uBkESLTP/oA+kj6UPQE+gAxIPQEAW6RMJHR4iP6RDDy0U34l4IQHc1lALzysCFukTGfAdDXLCAAAAC88r/TPzHR4iOCEAYFI0C64w8BEQCmA0RXEREQ1ywgvGoozI8P1ywgfFP1LOMPERwRHhEc4w0OESAOAK0ArgEbA2QxIoIQBfXhALqPHTAyVxFWEIIQBo53gLrjDxETER4REw4RFQ4OERMO4w0OER4ODhETDgCnAKgAqQSmVxARFvLi2/iSL8cF8tLE7UTQ1DHXTND6SDH6SNQx1DHXTND6SPpQMfpQMfQEMdGIcMjLX8mIbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyYgAtgF9AX0BKgM6VhCCEAcnDgC6jw1WEIIQDbWFgLrjDxEV4w0OERUAqgCrAKwE5jIREtD0AfQB9AHXTNBWFvLivvQB0wAx1wsJwQHy4sb4IwmBOECgKbkqgggJOoCgKrmw+JJWEMcFsfLi31YWwQry4PoRFqQRIYIY6JkKRgCgiHDIy1/JiG1tbQLI+lT6VPpUyW1tbS7I+lIT+lT6VPQAyYgAtgF9AX0BNASWVxBWE/Livu1E0NQx10zQ+kgx+kjUMdQx10zQ+kj6UDH6UDH0BDHRiHDIy1/JiG1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMmIALYBfQF9ASwD+FYQghA7i4fAuo9vVhCCEBgUjQC6juJWEIIQOwIzgLqOU1YQghAuUBRAuptXECRukzQQPpE/4o45MA+CEDTtzgC6ji34ksjPhQj6Uo0GgAAAAAAAAAAAAAAAAABqmTttgAAAAAAAAABAzxbJgQCg+wDe4hEe4w0RHuMN4w0BLQC0AS8EjFcQ7UTQ1DHXTND6SDH6SNQx1DHXTND6SPpQMfpQMfQEMdGIcMjLX8mIbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyYgAtgF9AX0BMgL8VyL4ki7HBfLgZBEh0z/6APpI+lD0AfoAIPQEAW6RMJHR4iP6RDDy0U34l/iTcPg6I3Jx4wT4OSBugRi3IuMEIW6BHRNYA+MEUCOoJaBzgQMscPg8oAFw+DagAXD4NqBzgQQCghAJZgGAcPg3oLzysHBWI8JklhEjpAERI+MNATYAtQNa1ywgAAAATI8c1ywgAAAADOMPER4RIBEeER8CER4CAxESAx5DMOMNERwRHhEcAK8A5QCwBNpXEFcfVx9XHxEQ8tLTC9M/0wnTAAGZ1DHUMdQx+kgx3vpI+kjU9AT4ku1E0NQx10zQ+kgx+kjUMdQx10zQ+kj6UDH6UDH0BDHRiHDIy1/JiG1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMmIALYBfQF9AToExFci+JIlxwXy4rwRIdM/+gD6SDAhViK58uLFESEhoe1E0NQx10zQ+kgx+kjUMdQx10zQ+kj6UDH6UDH0BDHRiHDIy1/JiG1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMmIALYBfQF9ATwBRb/YF2omh9AGoY66ZofSRqGOoY66ZofSR9KBj9KBj6AhjoxEALYAD7KOe1E0NdMgAFWzOntRND6ANMf1NMH0wHSAPoA+gD6ANIA0wPTE9MH0gDSANMJ0wnU1NTRgBKxXEFYbkX+X+JItxwXDAOLy4rztRNDUMddM0PpIMfpI1DHUMddM0PpI+lAx+lAx9AQx0YhwyMtfyYhtbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJiAC2AX0BfQEwBN5TUKBWJrvyryWgARElAaH4J28Q+Jeh+C+gc4EEAoIQCWYBgHD4N7YJcvsC7UTQ1DHXTND6SDH6SNQx1DHXTND6SPpQMfpQMfQEMdGIcMjLX8mIbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyYgAtgF9AX0BOAEU/wD0pBP0vPLICwC3AgFiALgAuQICxAC6AUYCASAAzQFAAgHVALsAvAH3PiRjnLTHzHtRNBwAtcsIIiIiIyYMDGCElQL5ACOStcsILxqKMyYbBLTPzH6ADCON9csIAAAAAyZMDGCHxdm9boAjiPXLCAAAABEkTCOFmwS1ywgAAAAtDGS8j/hgh8XK1rwAAHiAeLi4gH6AAKgyAH6As7J7VTgIO1E0IAC9BL87UTQ+gAx0yox+gAx+gAx+gAx0yAx0gDUMddM7UTQ1DHXTND6SDH6SNQx1DHXTND6SPpQMfpQMfQEMdGIcMjLX8mIbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyYiAAzgF9AX0BPQP++gDTH9MH0wHSAPoA+gD6ANIA0wPTE9MH0gDSANMJ0wnU1NdMAtAB0PpI+kjU1NQB0CfQA9AH0x/TH9cLHwP6SPpQB/QE9AT0BA76UPpQ+lAwESLXLCAAAAEU4w8OyPpUAREgAfpUAREeAfpUyQLI+lL6VBbOyQLIyx/LHxLLHwC+AL8A2AKoVyP4ki/HBfLgZBEi0z/6APpI+lD0BPoAMSD0BAFukTCR0eIj+kQw8tFN+JeCEB3NZQC88rAhbpExnwHQ1ywgAAAAvPK/0z8x0eIjghAGBSNAuuMPAREAwANEVxERENcsILxqKMyPD9csIHxT9SzjDxEcER4RHOMNDhEgDgDHAMgBGwNkMSKCEAX14QC6jx0wMlcRVhCCEAaOd4C64w8RExEeERMOERUODhETDuMNDhEeDg4REw4AwQDCAMMEplcQERby4tv4ki/HBfLSxO1E0NQx10zQ+kgx+kjUMdQx10zQ+kj6UDH6UDH0BDHRiHDIy1/JiG1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMmIAM4BfQF9ASoDOlYQghAHJw4Auo8NVhCCEA21hYC64w8RFeMNDhEVAMQAxQDGBOYyERLQ9AH0AfQB10zQVhby4r70AdMAMdcLCcEB8uLG+CMJgThAoCm5KoIICTqAoCq5sPiSVhDHBbHy4t9WFsEK8uD6ERakESGCGOiZCkYAoIhwyMtfyYhtbW0CyPpU+lT6VMltbW0uyPpSE/pU+lT0AMmIAM4BfQF9ATQEllcQVhPy4r7tRNDUMddM0PpIMfpI1DHUMddM0PpI+lAx+lAx9AQx0YhwyMtfyYhtbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJiADOAX0BfQEsA/hWEIIQO4uHwLqPb1YQghAYFI0Auo7iVhCCEDsCM4C6jlNWEIIQLlAUQLqbVxAkbpM0ED6RP+KOOTAPghA07c4Auo4t+JLIz4UI+lKNBoAAAAAAAAAAAAAAAAAAapk7bYAAAAAAAAAAQM8WyYEAoPsA3uIRHuMNER7jDeMNAS0AywEvBIxXEO1E0NQx10zQ+kgx+kjUMdQx10zQ+kj6UDH6UDH0BDHRiHDIy1/JiG1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMmIAM4BfQF9ATIC/Fci+JIuxwXy4GQRIdM/+gD6SPpQ9AH6ACD0BAFukTCR0eIj+kQw8tFN+Jf4k3D4OiNyceME+DkgboEYtyLjBCFugR0TWAPjBFAjqCWgc4EDLHD4PKABcPg2oAFw+Dagc4EEAoIQCWYBgHD4N6C88rBwViPCZJYRI6QBESPjDQE2AMwDWtcsIAAAAEyPHNcsIAAAAAzjDxEeESARHhEfAhEeAgMREgMeQzDjDREcER4RHADJAOUAygTaVxBXH1cfVx8REPLS0wvTP9MJ0wABmdQx1DHUMfpIMd76SPpI1PQE+JLtRNDUMddM0PpIMfpI1DHUMddM0PpI+lAx+lAx9AQx0YhwyMtfyYhtbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJiADOAX0BfQE6BMRXIviSJccF8uK8ESHTP/oA+kgwIVYiufLixREhIaHtRNDUMddM0PpIMfpI1DHUMddM0PpI+lAx+lAx9AQx0YhwyMtfyYhtbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJiADOAX0BfQE8BKxXEFYbkX+X+JItxwXDAOLy4rztRNDUMddM0PpIMfpI1DHUMddM0PpI+lAx+lAx9AQx0YhwyMtfyYhtbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJiADOAX0BfQEwBN5TUKBWJrvyryWgARElAaH4J28Q+Jeh+C+gc4EEAoIQCWYBgHD4N7YJcvsC7UTQ1DHXTND6SDH6SNQx1DHXTND6SPpQMfpQMfQEMdGIcMjLX8mIbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyYgAzgF9AX0BOAFFv9gXaiaH0Aahjrpmh9JGoY6hjrpmh9JH0oGP0oGPoCGOjEQAzgEU/wD0pBP0vPLICwDPAgFiANAA0QICxADSAUYCASAA6AFAAgHVANMA1AH3PiRjnLTHzHtRNBwAtcsIIiIiIyYMDGCElQL5ACOStcsILxqKMyYbBLTPzH6ADCON9csIAAAAAyZMDGCHxdm9boAjiPXLCAAAABEkTCOFmwS1ywgAAAAtDGS8j/hgh8XK1rwAAHiAeLi4gH6AAKgyAH6As7J7VTgIO1E0IADVBL87UTQ+gAx0yox+gAx+gAx+gAx0yAx0gDUMddM7UTQ1DHXTND6SDH6SNQx1DHXTND6SPpQMfpQMfQEMdGIcMjLX8mIbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyYiAA6QF9AX0BPQP++gDTH9MH0wHSAPoA+gD6ANIA0wPTE9MH0gDSANMJ0wnU1NdMAtAB0PpI+kjU1NQB0CfQA9AH0x/TH9cLHwP6SPpQB/QE9AT0BA76UPpQ+lAwESLXLCAAAAEU4w8OyPpUAREgAfpUAREeAfpUyQLI+lL6VBbOyQLIyx/LHxLLHwDWANcA2AKoVyP4ki/HBfLgZBEi0z/6APpI+lD0BPoAMSD0BAFukTCR0eIj+kQw8tFN+JeCEB3NZQC88rAhbpExnwHQ1ywgAAAAvPK/0z8x0eIjghAGBSNAuuMPAREA2QNEVxERENcsILxqKMyPD9csIHxT9SzjDxEcER4RHOMNDhEgDgDhAOIBGwCoyQbI+lIV+lITzMwSzM7JERTI9AABERUB9AAS9ADOycgBERH6Ah/LHx3LBxvLARnKAFAH+gJQBfoCUAP6AsoAywPLE8sHygDKAMsJywkTzMzMye1UA2QxIoIQBfXhALqPHTAyVxFWEIIQBo53gLrjDxETER4REw4RFQ4OERMO4w0OER4ODhETDgDaANsA3ASmVxARFvLi2/iSL8cF8tLE7UTQ1DHXTND6SDH6SNQx1DHXTND6SPpQMfpQMfQEMdGIcMjLX8mIbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyYgA6QF9AX0BKgM6VhCCEAcnDgC6jw1WEIIQDbWFgLrjDxEV4w0OERUA3QDeAN8E5jIREtD0AfQB9AHXTNBWFvLivvQB0wAx1wsJwQHy4sb4IwmBOECgKbkqgggJOoCgKrmw+JJWEMcFsfLi31YWwQry4PoRFqQRIYIY6JkKRgCgiHDIy1/JiG1tbQLI+lT6VPpUyW1tbS7I+lIT+lT6VPQAyYgA6QF9AX0BNASWVxBWE/Livu1E0NQx10zQ+kgx+kjUMdQx10zQ+kj6UDH6UDH0BDHRiHDIy1/JiG1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMmIAOkBfQF9ASwD+FYQghA7i4fAuo9vVhCCEBgUjQC6juJWEIIQOwIzgLqOU1YQghAuUBRAuptXECRukzQQPpE/4o45MA+CEDTtzgC6ji34ksjPhQj6Uo0GgAAAAAAAAAAAAAAAAABqmTttgAAAAAAAAABAzxbJgQCg+wDe4hEe4w0RHuMN4w0BLQDgAS8EjFcQ7UTQ1DHXTND6SDH6SNQx1DHXTND6SPpQMfpQMfQEMdGIcMjLX8mIbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyYgA6QF9AX0BMgSsVxBWG5F/l/iSLccFwwDi8uK87UTQ1DHXTND6SDH6SNQx1DHXTND6SPpQMfpQMfQEMdGIcMjLX8mIbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyYgA6QF9AX0BMAL8VyL4ki7HBfLgZBEh0z/6APpI+lD0AfoAIPQEAW6RMJHR4iP6RDDy0U34l/iTcPg6I3Jx4wT4OSBugRi3IuMEIW6BHRNYA+MEUCOoJaBzgQMscPg8oAFw+DagAXD4NqBzgQQCghAJZgGAcPg3oLzysHBWI8JklhEjpAERI+MNATYA4wNa1ywgAAAATI8c1ywgAAAADOMPER4RIBEeER8CER4CAxESAx5DMOMNERwRHhEcAOQA5QDmBN5TUKBWJrvyryWgARElAaH4J28Q+Jeh+C+gc4EEAoIQCWYBgHD4N7YJcvsC7UTQ1DHXTND6SDH6SNQx1DHXTND6SPpQMfpQMfQEMdGIcMjLX8mIbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyYgA6QF9AX0BOATaVxBXH1cfVx8REPLS0wvTP9MJ0wABmdQx1DHUMfpIMd76SPpI1PQE+JLtRNDUMddM0PpIMfpI1DHUMddM0PpI+lAx+lAx9AQx0YhwyMtfyYhtbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJiADpAX0BfQE6BP7XLCAAAAAUj3TXLCAAAAAsjunXLCAAAAA0nFcdVyERG/pIMdcLAY7O1ywgAAABxI5BVyIRIfpIMPiSAfAB+JKCEAX14QBt+CrIz5CUI1mrVhXPCwlWEQH6UhL0APQAycjPhQgT+lIB+gJxzwtqzMlz+wDjDhEb4hEbERLjDeMNAQAA5wEhASIExFci+JIlxwXy4rwRIdM/+gD6SDAhViK58uLFESEhoe1E0NQx10zQ+kgx+kjUMdQx10zQ+kj6UDH6UDH0BDHRiHDIy1/JiG1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMmIAOkBfQF9ATwAzFciESH6SDD4kgHwAVYa8tLEERKzVh6OTfiSi/YXV0aG9yaXR5RnJlZXpljIi8F41FGQAAAAAAAAAAjPFlYh+gJWE88LCc+BUvD6UlLw+lTPhCDOycjPhYgS+lJxzwtuzMmAUPsA3gFFv9gXaiaH0Aahjrpmh9JGoY6hjrpmh9JH0oGP0oGPoCGOjEQA6QEU/wD0pBP0vPLICwDqAgFiAOsA7AICxADtAUYCASABAQFAAgHVAO4A7wH3PiRjnLTHzHtRNBwAtcsIIiIiIyYMDGCElQL5ACOStcsILxqKMyYbBLTPzH6ADCON9csIAAAAAyZMDGCHxdm9boAjiPXLCAAAABEkTCOFmwS1ywgAAAAtDGS8j/hgh8XK1rwAAHiAeLi4gH6AAKgyAH6As7J7VTgIO1E0IADwBL87UTQ+gAx0yox+gAx+gAx+gAx0yAx0gDUMddM7UTQ1DHXTND6SDH6SNQx1DHXTND6SPpQMfpQMfQEMdGIcMjLX8mIbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyYiABBQF9AX0BPQP8+gDTH9MH0wHSAPoA+gD6ANIA0wPTE9MH0gDSANMJ0wnU1NdMAtAB0PpI+kjU1NQB0CfQA9AH0x/TH9cLHwP6SPpQB/QE9AT0BA76UPpQ+lAwESLXLCAAAAEU4w8RGcj6VAERIAH6VAERHgH6VMkCyPpS+lQWzskCyMsfyx8SAPEA8gEPA/pXI/iSL8cF8uBkESLTP/oA+kj6UPQE+gAg9AQBbpEwkdHiJPpEMPLRTfiXghAdzWUAvPKwcCNukTOOEjAC0NcsIAAAALzyv9M/0cABAuIlghA7msoAvo6SVxb4kiTHBZgQRV8FVxBXGuMOjxBsISOCEAYFI0C64w8OERkO4gDzAREA9ANMVxERENcsILxqKMyPD9csIHxT9SzjDxEcER4RHOMNDhEgDg4RGQ4A+wD8ARsB/nBWJMJkjkMwVyNwghgXhBGyAIIImJaAyIvHvdl94AAAAAAAAAAIzxYi+gJWFgH6UlJQ+lTJyM+FCFLw+lJY+gJxzwtqzMmAEfsAlhEkpAERJOJTUKBWJ7vyryWgAREmAaH4J28Q+Jeh+C+gc4EEAoIQCWYBgHD4N7YJcvsC7UQBAgNkMSKCEAX14QC6jx0wMlcRVhCCEAaOd4C64w8RExEeERMOERUODhETDuMNDhEeDg4REw4A9QD2APcEplcQERby4tv4ki/HBfLSxO1E0NQx10zQ+kgx+kjUMdQx10zQ+kj6UDH6UDH0BDHRiHDIy1/JiG1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMmIAQUBfQF9ASoDOlYQghAHJw4Auo8NVhCCEA21hYC64w8RFeMNDhEVAPgA+QD6BOYyERLQ9AH0AfQB10zQVhby4r70AdMAMdcLCcEB8uLG+CMJgThAoCm5KoIICTqAoCq5sPiSVhDHBbHy4t9WFsEK8uD6ERakESGCGOiZCkYAoIhwyMtfyYhtbW0CyPpU+lT6VMltbW0uyPpSE/pU+lT0AMmIAQUBfQF9ATQEllcQVhPy4r7tRNDUMddM0PpIMfpI1DHUMddM0PpI+lAx+lAx9AQx0YhwyMtfyYhtbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJiAEFAX0BfQEsA/hWEIIQO4uHwLqPb1YQghAYFI0Auo7iVhCCEDsCM4C6jlNWEIIQLlAUQLqbVxAkbpM0ED6RP+KOOTAPghA07c4Auo4t+JLIz4UI+lKNBoAAAAAAAAAAAAAAAAAAapk7bYAAAAAAAAAAQM8WyYEAoPsA3uIRHuMNER7jDeMNAS0BAwEvBIxXEO1E0NQx10zQ+kgx+kjUMdQx10zQ+kj6UDH6UDH0BDHRiHDIy1/JiG1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMmIAQUBfQF9ATIC/Fci+JIuxwXy4GQRIdM/+gD6SPpQ9AH6ACD0BAFukTCR0eIj+kQw8tFN+Jf4k3D4OiNyceME+DkgboEYtyLjBCFugR0TWAPjBFAjqCWgc4EDLHD4PKABcPg2oAFw+Dagc4EEAoIQCWYBgHD4N6C88rBwViPCZJYRI6QBESPjDQE2AQQDWtcsIAAAAEyPHNcsIAAAAAzjDxEeESARHhEfAhEeAgMREgMeQzDjDREcER4RHAD9AP4A/wTaVxBXH1cfVx8REPLS0wvTP9MJ0wABmdQx1DHUMfpIMd76SPpI1PQE+JLtRNDUMddM0PpIMfpI1DHUMddM0PpI+lAx+lAx9AQx0YhwyMtfyYhtbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJiAEFAX0BfQE6BP7XLCAAAAAUj3TXLCAAAAAsjunXLCAAAAA0nFcdVyERG/pIMdcLAY7O1ywgAAABxI5BVyIRIfpIMPiSAfAB+JKCEAX14QBt+CrIz5CUI1mrVhXPCwlWEQH6UhL0APQAycjPhQgT+lIB+gJxzwtqzMlz+wDjDhEb4hEbERLjDeMNAQABIAEhASIExFci+JIlxwXy4rwRIdM/+gD6SDAhViK58uLFESEhoe1E0NQx10zQ+kgx+kjUMdQx10zQ+kj6UDH6UDH0BDHRiHDIy1/JiG1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMmIAQUBfQF9ATwD3tcsIShGs1SPZNcsIAAAAESO09csIsr4PeSaXw9fD18FhA/y8ODXLCabkKxkji8wVyEmkXCX+JIlxwXDAOKOHTY9VxBXF1cbf3/4I/go+CgRHwMRGgMEERIERuQC3uMOERoBERQB4w0RGgERFAHjDQEjAVgBWQFFv9gXaiaH0Aahjrpmh9JGoY6hjrpmh9JH0oGP0oGPoCGOjEQBBQSE0NQx10zQ+kgx+kjUMdQx10zQ+kj6UDH6UDH0BDHRiHDIy1/JiG1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMmIAQUBfQF9ASgErFcQVhuRf5f4ki3HBcMA4vLivO1E0NQx10zQ+kgx+kjUMdQx10zQ+kj6UDH6UDH0BDHRiHDIy1/JiG1tbQLI+lT6VPpUyW1tbQfI+lIS+lT6VBX0AMmIAQUBfQF9ATAE3lNQoFYmu/KvJaABESUBofgnbxD4l6H4L6BzgQQCghAJZgGAcPg3tgly+wLtRNDUMddM0PpIMfpI1DHUMddM0PpI+lAx+lAx9AQx0YhwyMtfyYhtbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJiAEFAX0BfQE4ART/APSkE/S88sgLAQYCAWIBBwEIAgLEAQkBRgIBIAE/AUACAdUBCgELAfc+JGOctMfMe1E0HAC1ywgiIiIjJgwMYISVAvkAI5K1ywgvGoozJhsEtM/MfoAMI431ywgAAAADJkwMYIfF2b1ugCOI9csIAAAAESRMI4WbBLXLCAAAAC0MZLyP+GCHxcrWvAAAeIB4uLiAfoAAqDIAfoCzsntVOAg7UTQgAQwEvztRND6ADHTKjH6ADH6ADH6ADHTIDHSANQx10ztRNDUMddM0PpIMfpI1DHUMddM0PpI+lAx+lAx9AQx0YhwyMtfyYhtbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJiIAFBAX0BfQE9A/z6ANMf0wfTAdIA+gD6APoA0gDTA9MT0wfSANIA0wnTCdTU10wC0AHQ+kj6SNTU1AHQJ9AD0AfTH9Mf1wsfA/pI+lAH9AT0BPQEDvpQ+lD6UDARItcsIAAAARTjDxEZyPpUAREgAfpUAREeAfpUyQLI+lL6VBbOyQLIyx/LHxIBDQEOAQ8D+lcj+JIvxwXy4GQRItM/+gD6SPpQ9AT6ACD0BAFukTCR0eIk+kQw8tFN+JeCEB3NZQC88rBwI26RM44SMALQ1ywgAAAAvPK/0z/RwAEC4iWCEDuaygC+jpJXFviSJMcFmBBFXwVXEFca4w6PEGwhI4IQBgUjQLrjDw4RGQ7iARABEQESA0xXEREQ1ywgvGoozI8P1ywgfFP1LOMPERwRHhEc4w0OESAODhEZDgEZARoBGwCuyx/JBsj6UhX6UhPMzBLMzskRFMj0AAERFQH0AB30ABzOycgBERH6Ah/LHx3LBxvLARnKAFAH+gJQBfoCUAP6AsoAywPLE8sHygDKAMsJywkTzMzMye1UAf5wViTCZI5DMFcjcIIYF4QRsgCCCJiWgMiLx73ZfeAAAAAAAAAACM8WIvoCVhYB+lJSUPpUycjPhQhS8PpSWPoCcc8LaszJgBH7AJYRJKQBESTiU1CgVie78q8loAERJgGh+CdvEPiXofgvoHOBBAKCEAlmAYBw+De2CXL7Au1EAScA5hNfA1cR+CMpgggJOoCgIbny4t+CC8JnACqgIbycgggJOoBQC6AqucMAkjpw4vLi34IgChr7NUYAghA7msoAVhiooBEhViGgyM+R73ZfehLLPwERIfoCUuD6UgEREAH6VMnIz4UIUmD6UnHPC27MyYBQ+wADZDEighAF9eEAuo8dMDJXEVYQghAGjneAuuMPERMRHhETDhEVDg4REw7jDQ4RHg4OERMOARMBFAEVBKZXEBEW8uLb+JIvxwXy0sTtRNDUMddM0PpIMfpI1DHUMddM0PpI+lAx+lAx9AQx0YhwyMtfyYhtbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJiAFBAX0BfQEqAzpWEIIQBycOALqPDVYQghANtYWAuuMPERXjDQ4RFQEWARcBGATmMhES0PQB9AH0AddM0FYW8uK+9AHTADHXCwnBAfLixvgjCYE4QKApuSqCCAk6gKAqubD4klYQxwWx8uLfVhbBCvLg+hEWpBEhghjomQpGAKCIcMjLX8mIbW1tAsj6VPpU+lTJbW1tLsj6UhP6VPpU9ADJiAFBAX0BfQE0BJZXEFYT8uK+7UTQ1DHXTND6SDH6SNQx1DHXTND6SPpQMfpQMfQEMdGIcMjLX8mIbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyYgBQQF9AX0BLAP4VhCCEDuLh8C6j29WEIIQGBSNALqO4lYQghA7AjOAuo5TVhCCEC5QFEC6m1cQJG6TNBA+kT/ijjkwD4IQNO3OALqOLfiSyM+FCPpSjQaAAAAAAAAAAAAAAAAAAGqZO22AAAAAAAAAAEDPFsmBAKD7AN7iER7jDREe4w3jDQEtAS4BLwSMVxDtRNDUMddM0PpIMfpI1DHUMddM0PpI+lAx+lAx9AQx0YhwyMtfyYhtbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJiAFBAX0BfQEyAvxXIviSLscF8uBkESHTP/oA+kj6UPQB+gAg9AQBbpEwkdHiI/pEMPLRTfiX+JNw+DojcnHjBPg5IG6BGLci4wQhboEdE1gD4wRQI6gloHOBAyxw+DygAXD4NqABcPg2oHOBBAKCEAlmAYBw+DegvPKwcFYjwmSWESOkAREj4w0BNgE3A1rXLCAAAABMjxzXLCAAAAAM4w8RHhEgER4RHwIRHgIDERIDHkMw4w0RHBEeERwBHAEdAR4C/FciESHTP/oA0wnSAPpI+lD6ADH4kiPwASRWGLqRNOMOESQkoAKOVoIQBfXhAIsCINcsBTHyiW2CAYagyM+QXjUUZinPCz8o+gLPiADAE/pS+lQB+gIkzxbJVHYhyM+FCFLg+lIB+gKCEGQrfQfPC4oSyz/6Ulj6AszJc/sA3gElASYE2lcQVx9XH1cfERDy0tML0z/TCdMAAZnUMdQx1DH6SDHe+kj6SNT0BPiS7UTQ1DHXTND6SDH6SNQx1DHXTND6SPpQMfpQMfQEMdGIcMjLX8mIbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyYgBQQF9AX0BOgT+1ywgAAAAFI901ywgAAAALI7p1ywgAAAANJxXHVchERv6SDHXCwGOztcsIAAAAcSOQVciESH6SDD4kgHwAfiSghAF9eEAbfgqyM+QlCNZq1YVzwsJVhEB+lIS9AD0AMnIz4UIE/pSAfoCcc8LaszJc/sA4w4RG+IRGxES4w3jDQEfASABIQEiBMRXIviSJccF8uK8ESHTP/oA+kgwIVYiufLixREhIaHtRNDUMddM0PpIMfpI1DHUMddM0PpI+lAx+lAx9AQx0YhwyMtfyYhtbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJiAFBAX0BfQE8A/jXLCEoRrNUj3HXLCAAAABEjuDXLCLK+D3kml8PXw9fBYQP8vDg1ywmm5CsZI48MFchJpFwl/iSJccFwwDijio2PVcQVxdXG38RGoIQO5rKAKB/+CP4KPgoER8EER4EAxEaAwQREgRG5ALe4w4RGgERFAHjDREaAREUAeMNASMBWAFZAMJXIhEh+kgw+JIB8AERErNWHo5N+JKL9hdXRob3JpdHlGcmVlemWMiLwXjUUZAAAAAAAAAACM8WViH6AlYTzwsJz4FS8PpSUvD6VM+EIM7JyM+FiBL6UnHPC27MyYBQ+wDeACwwVyH4klYgxwX4klYQxwWx8uLkERKzACoBESABERIRHxESAREeAQIREgIDQe4B7tcsI5sWhOSONVciESHTP/oA+kiCCA9CQMjPkc2LQnIVyz9QA/oC+lLOycjPhQhS8PpSWPoCcc8LaszJc/sAjrbXLCCIiIiMjitXIhEh+kj6ADD4kljwAcjPhYhSYPpSghARERERzwuOUuD6UgH6AsmAUPsA4w7iASQA/tcsIAAAAKybMFch+JItxwXy4ryOadcsIAAAALSfVyIRIdNAMfpIMPiSAfABjk/XLCAAAACkMY43VyH4ki3HBfLivPiSyM+FCPpSjQaAAAAAAAAAAAAAAAAAAGqZO22AAAAAAAAAAEDPFsmBAKD7AJyEDxEixwABESIB8vTi4uIAxgRWF7mONfiSghAF9eEAbfgqyM+QlCNZq1YbzwsJVhcB+lIS9AD0AMnIz4UIE/pSAfoCcc8LaszJc/sAjiX4koIQBfXhAMjPhQgS+lIB+gKAOM8LilYTAfpSVhfPCwnJc/sA4gDegggPQkDIz5HNi0JyJs8LP1AF+gJSEPpSE87JyM+FCFYSAfpSUAT6AnHPC2oTzMlz+wBWIW6zAhEiAeME+Jf4J28QovgvoHOBBAKCEAlmAYBw+De2CXL7AsjPhQj6UoIQ1TJ2288Ljss/yYEAgvsABITQ1DHXTND6SDH6SNQx1DHXTND6SPpQMfpQMfQEMdGIcMjLX8mIbW1tAsj6VPpU+lTJbW1tB8j6UhL6VPpUFfQAyYgBQQF9AX0BKAT8iIiIA8jMEszMzMkqyPpSF/pSEswUzBPME8zJbW1tbcj0AHDPCzTJA8j0ABL0APQAzMnIi+AAAAABAAAAoAAAAEAAAs8WE8zMzMl4USLIz4PLBM+FoMzM+RaE97AVgAtQBtckyM+KAEDOFMv3z1BWF1YUyM+QXjUUZhjLP1AGAX0BfQF9ASkAevoCFcsJygAU+lIT+lQBESD6AgEREQHOycjPhYgBER8B+lJxzwtuAREeAczJgQCQ+wAOER4ODhEcDg4RGQ4E/oiIiAPIzBLMzMzJVhXI+lIX+lISzBTME8wTzMltbW1tyPQAcM8LNMkDyPQAEvQA9ADMyciL4AAAAAEAAACgAAAAQAACzxYTzMzMyXhRIsjPg8sEz4WgzMz5FoT3sAEREAGACwEREdckyM+KAEDOH8v3z1BwyM+GoFIiERGBAQsBfQF9AX0BKwAw9EHIz4UIEvpSgQEazwuTUtD6UsmAUPsABPqIiIgDyMwSzMzMyVYWyPpSF/pSEswUzBPME8zJbW1tbcj0AHDPCzTJA8j0ABL0APQAzMnIi+AAAAABAAAAoAAAAEAAAs8WE8zMzMl4USLIz4PLBM+FoMzM+RaE97ABEREBgAsBERLXJMjPigBAzgEREAHL989QyM+FiPpScgF9AX0BfQF0AFwwPxEeghJUC+QAoYISVAvkAMjPhYhSYPpSghARERERzwuOUuD6UgH6AsmAUPsABKxXEFYbkX+X+JItxwXDAOLy4rztRNDUMddM0PpIMfpI1DHUMddM0PpI+lAx+lAx9AQx0YhwyMtfyYhtbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJiAFBAX0BfQEwAEowP4IQBfXhAMjPhQhSYPpSAfoCgDjPC4pS0PpSVhHPCwnJc/sABP6IiIgDyMwSzMzMyVYWyPpSF/pSEswUzBPME8zJbW1tbcj0AHDPCzTJA8j0ABL0APQAzMnIi+AAAAABAAAAoAAAAEAAAs8WE8zMzMl4USLIz4PLBM+FoMzM+RaE97ABEREBgAsBERLXJMjPigBAzgEREAHL989QLcjPhYgS+lJ1AX0BfQF9ATEAFM8LjvpSyYBQ+wAE+oiIiAPIzBLMzMzJVhbI+lIX+lISzBTME8wTzMltbW1tyPQAcM8LNMkDyPQAEvQA9ADMyciL4AAAAAEAAACgAAAAQAACzxYTzMzMyXhRIsjPg8sEz4WgzMz5FoT3sAEREQGACwEREtckyM+KAEDOAREQAcv3z1BSAoEBC/RiAX0BfQF9ATMAQvLi3NMD0QERFwGgyM+FCBL6UoEBCs8Lk1LQ+lLJgFD7AAT+iIiIA8jMEszMzMlWF8j6UlYVAfpSFMwSzMzMyW1tbW3I9ABwzws0yQPI9AAS9AD0AMzJyIvgAAAAAQAAAKAAAABAAALPFhPMzMzJePgqbVYYVhVWKsjPkAAAAAYayz8SywnPgfpSF/pSzBX0AAERGQHOycjPiYgBVhlTNcjPgwF9AX0BfQE1AGzLBM+FoMzM+RaE97ARFYALJtckNRTOARETAcv3gRUNzwt5ARESAcwBERYBzAERFQHMyYBQ+wAAhjBXInCCGBeEEbIAggiYloDIi8e92X3gAAAAAAAAAAjPFiL6AlYVAfpSUlD6VMnIz4UIUuD6Ulj6AnHPC2rMyYAR+wAE3lNQoFYmu/KvJaABESUBofgnbxD4l6H4L6BzgQQCghAJZgGAcPg3tgly+wLtRNDUMddM0PpIMfpI1DHUMddM0PpI+lAx+lAx9AQx0YhwyMtfyYhtbW0CyPpU+lT6VMltbW0HyPpSEvpU+lQV9ADJiAFBAX0BfQE4BPyIiIgDyMwSzMzMySrI+lIX+lISzBTME8wTzMltbW1tyPQAcM8LNMkDyPQAEvQA9ADMyciL4AAAAAEAAACgAAAAQAACzxYTzMzMyXhRIsjPg8sEz4WgzMz5FoT3sBWAC1AG1yTIz4oAQM4Uy/fPUFYWVhPIz5BeNRRmGMs/UAYBfQF9AX0BOQBe+gIVywnPgRX6UvpUUAP6AgERHwHOycjPhYgBER8B+lJxzwtuAREeAczJgQCQ+wAE+IiIiAPIzBLMzMzJLMj6Uhf6UhLMFMwTzBPMyW1tbW3I9ABwzws0yQPI9AAS9AD0AMzJyIvgAAAAAQAAAKAAAABAAALPFhPMzMzJeChUEjLIz4PLBM+FoMzM+RaE97ASgAtQA9ckyM+KAEDOy/fPUMcF8uK8f4IQO5rKACsBfQF9AX0BOwDclBAnbDKOMzs+VyH4I/iSViLIzsknVha8jhJXFSP7BAPQ7R7tUwHxCK4EERKUECdsMuIBESABUMwECOL4koIID0JAyM+QAAAAEhjLP1YQAfpSFfpSFc7JyM+FCFJw+lJQBvoCcc8LahXMyYBQ+wAE/IiIiAPIzBLMzMzJVijI+lIX+lISzBTME8wTzMltbW1tyPQAcM8LNMkDyPQAEvQA9ADMyciL4AAAAAEAAACgAAAAQAACzxYTzMzMyXhRIsjPg8sEz4WgzMz5FoT3sAERIwGACwERJNckyM+KAEDOAREiAcv3z1BtiwhWFVYSyAF9AX0BfQFcBP6IiIgDyMwSzMzMySnI+lIX+lISzBTME8wTzMltbW1tyPQAcM8LNMkDyPQAEvQA9ADMyciL4AAAAAEAAACgAAAAQAACzxYTzMzMyXhRIsjPg8sEz4WgzMz5FoT3sBSAC1AF1yTIz4oAQM4Ty/fPUCPHBZVsIfLivuAw0PpIMfpIAX0BfQF9AT4ANjHUMdQx1NQx0dD6SPpQMfpQMfQEMdHHBfLgSgFFv9gXaiaH0Aahjrpmh9JGoY6hjrpmh9JH0oGP0oGPoCGOjEQBQQBTvudPaiaH0AaY/pg+mA6QB9AH0AfQBpAGmB6Ynpg+kAaQBphOmE6mpqaMART/APSkE/S88sgLAUICAWIBQwFEAgLEAUUBRgIBIAFjAWQCAdUBRwFIAAesVxhAAfc+JGOctMfMe1E0HAC1ywgiIiIjJgwMYISVAvkAI5K1ywgvGoozJhsEtM/MfoAMI431ywgAAAADJkwMYIfF2b1ugCOI9csIAAAAESRMI4WbBLXLCAAAAC0MZLyP+GCHxcrWvAAAeIB4uLiAfoAAqDIAfoCzsntVOAg7UTQgAUkExztRND6ADHTKjH6ADH6ADH6ADHTIDHSANQx10ztRNDUMdTUMddMAdD6SDH6SNQx1DHXTND6SPpQMfpQMfQEMdFwyMtfyYhtbW0CyPpU+lT6VMltbW0GyPpSEvpU+lQU9ADJiIiABfQF9AX0BYQT++gDTH9MH0wHSAPoA+gD6ANIA0wPTE9MH0gDSANMJ1NTUINdMBNAD0PpI+kjU1NQB0CfQA9AJ0x/TH9cLHwP6SPpQB/QE9AT0BBEQ+lD6UPpQMBEj1ywgvGoozI8R1ywgfFP1LOMPDxEgDw0RGQ3jDREgyPpUH/pUAREeAfpUyQFKAUsBTAFNA/ZXJPiSL8cF8uBkESPTP/oA+kj6UPQE+gAg9AQBbpEwkdHiJPpEMPLRTfiXghAdzWUAvPKwcCNukTOZMALQ0z/RwAEC4iWCEDuaygC+jpZXFlcX+JIjxwWaEDRfBFcQVxFXGuMOjxRsISOCEAYFI0C64w8PER4PDREZDeIBZQFmAWcDbFcRVxIP1ywgAAAATI8c1ywgAAAADOMPER4RIBEeER8CER4CAxESAx9DMOMNDxEgDw8RGQ8Q3wFOAU8BUAP+VxFXElciDtM/+gDTCdIA+kj6UPoAMfiSI/ABJFYYupE04w4RJCSgAuMAgggPQkDIz5HNi0JyJs8LP1AF+gJSEPpSE87JyM+FCFYRAfpSUAT6AnHPC2oTzMlz+wBWIW6zAhEiAeME+Jf4J28QovgvoHOBBAKCEAlmAYBw+De2CQFeAV8BYADmAcj6UgERHQH6VBXOyQHIyx8Uyx/LH8kFyPpSFPpSEswBERcBzAERFgHMAREVAc7JBMj0AAERFQH0APQAzsnIARER+gIfyx8dywcbywEZygBQB/oCUAX6AlAD+gLKAMsDyxPLB8oAygDLCRPMEszMzsntVATiVxFXH1cfVx8REPLS0wzTP9MJ0wABmdQx1DHUMfpIMd76SPpI1PQE+JLtRNDUMdTUMddMAdD6SDH6SNQx1DHXTND6SPpQMfpQMfQEMdFwyMtfyYhtbW0CyPpU+lT6VMltbW0GyPpSEvpU+lQU9ADJiIgBfQF9AX0BUQT+1ywgAAAAFI901ywgAAAALI7p1ywgAAAANJxXHVchERv6SDHXCwGOztcsIAAAAcSOQVciESH6SDD4kgHwAfiSghAF9eEAbfgqyM+QlCNZq1YVzwsJVhAB+lIS9AD0AMnIz4UIE/pSAfoCcc8LaszJc/sA4w4RG+IRGxES4w3jDQFTAVQBVQFWBMxXIviSJMcF8uK8ESHTP/oA+kgwIVYiufLixREhIaHtRNDUMdTUMddMAdD6SDH6SNQx1DHXTND6SPpQMfpQMfQEMdFwyMtfyYhtbW0CyPpU+lT6VMltbW0GyPpSEvpU+lQU9ADJiIgBfQF9AX0BWwP6iIgDyMwSzMzMySzI+lIW+lISzBPMEswSzMltbW1tyPQAcM8LNMkDyPQAEvQA9ADMySPIi9AAAAABAAAAoAAAAEAIzxYUzBLMzMzJeChUEjLIz4PLBM+FoMzM+RaE97ASgAtQA9ckyM+KAEDOy/fPUMcF8uK8f4IQO5rKACoBfQF9AVIA1pQQJ2wyjjA6PVcQ+CP4klYRyM7JJ1YWvI4SVxUj+wQD0O0e7VMB8QiuBBESlBAnbDLiULsPBAfi+JKCCA9CQMjPkAAAABIYyz9S8PpSFfpSFc7JyM+FCFYSAfpSUAb6AnHPC2oVzMmAUPsAA/jXLCEoRrNUj3HXLCAAAABEjuDXLCLK+D3kml8PXw9fBYQP8vDg1ywmm5CsZI48MFchJZFwl/iSJMcFwwDijio1PlcQVxdXG38RGoIQO5rKAKB/+CP4KPgoER8EER4EAxEaAwQREgRF9ALe4w4RGgERFAHjDREaAREUAeMNAVcBWAFZAMJXIhEh+kgw+JIB8AERErNWHo5N+JKL9hdXRob3JpdHlGcmVlemWMiLwXjUUZAAAAAAAAAACM8WViH6AlYTzwsJz4FS4PpSUuD6VM+EIM7JyM+FiBL6UnHPC27MyYBQ+wDeACwwVyH4klYgxwX4klYRxwWx8uLkERKzACoBESABERIRHxESAREeAQIREgIDQf8B7tcsI5sWhOSONVciESHTP/oA+kiCCA9CQMjPkc2LQnIVyz9QA/oC+lLOycjPhQhS4PpSWPoCcc8LaszJc/sAjrbXLCCIiIiMjitXIhEh+kj6ADD4kljwAcjPhYhSUPpSghARERERzwuOUtD6UgH6AsmAUPsA4w7iAVoAVlccVyERGtIA0wP6SDD4kgHwAQGVAREUAaCVAREUAaHiIIIID0JAvH9w4wQAWlciESHTADHTCfpI9AT0BfiSUAPwAVYTI7mfVxMg+wTQ7R7tUxER8Qiukl8D4gD+1ywgAAAArJswVyH4kizHBfLivI5p1ywgAAAAtJ9XIhEh00Ax+kgw+JIB8AGOT9csIAAAAKQxjjdXIfiSLMcF8uK8+JLIz4UI+lKNBoAAAAAAAAAAAAAAAAAAapk7bYAAAAAAAAAAQM8WyYEAoPsAnIQPESLHAAERIgHy9OLi4gP+iIgDyMwSzMzMyVYoyPpSFvpSEswTzBLMEszJbW1tbcj0AHDPCzTJA8j0ABL0APQAzMkjyIvQAAAAAQAAAKAAAABACM8WFMwSzMzMyXhRIsjPg8sEz4WgzMz5FoT3sAERIwGACwERJNckyM+KAEDOAREiAcv3z1BtiwhWFVYRyAF9AX0BXAFUic8WF8s/UAX6AhTLCc+BFPpSE/pUz4QgzsnIz4WIEvpScc8LbszJcvsAAV0ACBeNRRkAxgRWF7mONfiSghAF9eEAbfgqyM+QlCNZq1YbzwsJVhYB+lIS9AD0AMnIz4UIE/pSAfoCcc8LaszJc/sAjiX4koIQBfXhAMjPhQgS+lIB+gKAOM8LilYSAfpSVhfPCwnJc/sA4gCsghAF9eEAiwIg1ywFMfKJbYIBhqDIz5BeNRRmKc8LPyj6As+IAMAT+lL6VAH6AiTPFslUdiHIz4UIUtD6UgH6AoIQZCt9B88LihLLP/pSWPoCzMlz+wAANHL7AsjPhQj6UoIQ1TJ2288Ljss/yYEAgvsAA/yIiAPIzBLMzMzJKcj6Uhb6UhLME8wSzBLMyW1tbW3I9ABwzws0yQPI9AAS9AD0AMzJI8iL0AAAAAEAAACgAAAAQAjPFhTMEszMzMl4USLIz4PLBM+FoMzM+RaE97AUgAtQBdckyM+KAEDOE8v3z1AjxwWVbCHy4r7gMND6SDEBfQF9AWIAOvpIMdQx1DHU1DHR0PpI+lAx+lAx9AQx0ccF8uBKAE2/2BdqJofQBqGOpqGOumAOh9JGoY6hjrpmh9JH0oGP0oGPoCGOisQAUb7nT2omh9AGmP6YPpgOkAfQB9AH0AaQBpgemJ6YPpAGkAaYTqampqaMAf5wViTCZI5DMFcjcIIYF4QRsgCCCJiWgMiLx73ZfeAAAAAAAAAACM8WIvoCVhUB+lJSQPpUycjPhQhS4PpSWPoCcc8LaszJgBH7AJYRJKQBESTiU0CgVie78q8koAERJgGh+CdvEPiXofgvoHOBBAKCEAlmAYBw+De2CXL7Au1EAWgA6hNfA1cRVxL4IyiCCAk6gKAhufLi34ILwmcAKaAhvJyCCAk6gFAKoCm5wwCSOXDi8uLfgiAKGvs1RgCCEDuaygBWGKigESFWIaDIz5Hvdl96ARETAcs/AREh+gJS0PpSH/pUycjPhQhSUPpScc8LbszJgFD7AANgMSKCEAX14QC6jxswMlcRVxIvghAGjneAuuMPERMRHhETDRETDQ/jDRETER4RExDfAWsBbAFtBIzQ1DHU1DHXTAHQ+kgx+kjUMdQx10zQ+kj6UDH6UDH0BDHRcMjLX8mIbW1tAsj6VPpU+lTJbW1tBsj6UhL6VPpUFPQAyYiIAX0BfQF9AWkD/oiIA8jMEszMzMkpyPpSFvpSEswTzBLMEszJbW1tbcj0AHDPCzTJA8j0ABL0APQAzMkjyIvQAAAAAQAAAKAAAABACM8WFMwSzMzMyXhRIsjPg8sEz4WgzMz5FoT3sBSAC1AF1yTIz4oAQM4Ty/fPUFYXVhPIz5BeNRRmF8s/UAUBfQF9AWoAjPoCFMsJAREjAcoAE/pSAREhAfpUARET+gIBERABzsnIz4WIAREfAfpScc8LbgERHgHMyYEAkPsADxEeDw8RHA8PERkPEN8Erj8RFvLi2/iSVhDHBfLSxO1E0NQx1NQx10wB0PpIMfpI1DHUMddM0PpI+lAx+lAx9AQx0XDIy1/JiG1tbQLI+lT6VPpUyW1tbQbI+lIS+lT6VBT0AMmIiAF9AX0BfQFuAzovghAHJw4Auo8OL4IQDbWFgLrjDw8RFQ/jDQ8RFQFwAXEBcgTqMhES0PQB9AH0AddM0FYX8uK+9AHTADHXCwnBAfLixvgjCYE4QKApuSqCCAk6gKAqubD4klYQxwWx8uLfVheBAPq58uD6ERekESKCGOiZCkYAoHDIy1/JiG1tbQLI+lT6VPpUyW1tbS3I+lIT+lT6VPQAyYiIAX0BfQF9AXwD/IiIA8jMEszMzMlWFsj6Uhb6UhLME8wSzBLMyW1tbW3I9ABwzws0yQPI9AAS9AD0AMzJI8iL0AAAAAEAAACgAAAAQAjPFhTMEszMzMl4USLIz4PLBM+FoMzM+RaE97ABEREBgAsBERLXJMjPigBAzgEREAHL989QcMjPhqBSIgF9AX0BbwA6ERiBAQv0QcjPhQgS+lKBARrPC5NSwPpSyYBQ+wAEnD9WE/Livu1E0NQx1NQx10wB0PpIMfpI1DHUMddM0PpI+lAx+lAx9AQx0XDIy1/JiG1tbQLI+lT6VPpUyW1tbQbI+lIS+lT6VBT0AMmIiAF9AX0BfQFzA/YvghA7i4fAuo9vL4IQGBSNALqO4y+CEDsCM4C6jlUvghAuUBRAups/I26TMxAvklcQ4o48VxEOghA07c4Auo4t+JLIz4UI+lKNBoAAAAAAAAAAAAAAAAAAapk7bYAAAAAAAAAAQM8WyYEAoPsA3hDf4hEe4w0RHuMN4w0BdQF2AXcEkj/tRNDUMdTUMddMAdD6SDH6SNQx1DHXTND6SPpQMfpQMfQEMdFwyMtfyYhtbW0CyPpU+lT6VMltbW0GyPpSEvpU+lQU9ADJiIgBfQF9AX0BegP8iIgDyMwSzMzMyVYXyPpSFvpSEswTzBLMEszJbW1tbcj0AHDPCzTJA8j0ABL0APQAzMkjyIvQAAAAAQAAAKAAAABACM8WFMwSzMzMyXhRIsjPg8sEz4WgzMz5FoT3sAEREgGACwERE9ckyM+KAEDOARERAcv3z1DIz4WI+lJyAX0BfQF0ABDPC47JgFD7AABeP1cQER6CElQL5AChghJUC+QAyM+FiFJQ+lKCEBERERHPC45S0PpSAfoCyYBQ+wAEsj9WG5F/l/iSLMcFwwDi8uK87UTQ1DHU1DHXTAHQ+kgx+kjUMdQx10zQ+kj6UDH6UDH0BDHRcMjLX8mIbW1tAsj6VPpU+lTJbW1tBsj6UhL6VPpUFPQAyYiIAX0BfQF9AXgATD9XEIIQBfXhAMjPhQhSUPpSAfoCgDjPC4pSwPpSVhHPCwnJc/sAA/6IiAPIzBLMzMzJVhfI+lIW+lISzBPMEswSzMltbW1tyPQAcM8LNMkDyPQAEvQA9ADMySPIi9AAAAABAAAAoAAAAEAIzxYUzBLMzMzJeFEiyM+DywTPhaDMzPkWhPewARESAYALARET1yTIz4oAQM4BEREBy/fPUCzIz4WIEvpSAX0BfQF5ABZ1zwuO+lLJgFD7AAP+iIgDyMwSzMzMyVYXyPpSFvpSEswTzBLMEszJbW1tbcj0AHDPCzTJA8j0ABL0APQAzMkjyIvQAAAAAQAAAKAAAABACM8WFMwSzMzMyXhRIsjPg8sEz4WgzMz5FoT3sAEREgGACwERE9ckyM+KAEDOARERAcv3z1AgERGBAQv0YgF9AX0BewBI8uLc0wPRAREXAaDIz4UIARERAfpSgQEKzwuTUsD6UsmAUPsAA/6IiAPIzBLMzMzJVhbI+lJWFAH6UhTMEszMzMltbW1tyPQAcM8LNMkDyPQAEvQA9ADMyVYWyIvQAAAAAQAAAKAAAABACM8WFMwSzMzMyXj4Km1WGFYUVirIz5AAAAAGGcs/EssJz4H6Uhb6UswU9AABERkBzsnIz4mIAVYZVhYlAX0BfQF+AAAAcsjPg8sEz4WgzMz5FoT3sBEUgAsl1yQ0E84BERIBy/eBFQ3PC3kBERMBzAERFgHMARERAczJgFD7AA==');

    static Errors = {
        'Errors.BalanceError': 47,
        'Errors.NotEnoughGas': 48,
        'Errors.NotValidWallet': 74,
        'Errors.NotOwner': 100,
        'Errors.MaxConnections': 250,
        'Errors.WrongWorkchain': 333,
        'Errors.IncorrectSender': 700,
        'Errors.AccountInactive': 702,
        'Errors.IncorrectReceiver': 708,
        'Errors.InsufficientBalance': 709,
        'Errors.AlreadyReported': 710,
        'Errors.AlreadyInvited': 723,
        'Errors.NoVotesAvailable': 731,
        'Errors.NotVotedYet': 732,
        'Errors.WaitMore': 735,
        'Errors.InviteFirst': 740,
        'Errors.InvalidMessage': 65535,
    }

    readonly address: c.Address
    readonly init: { code: c.Cell, data: c.Cell } | undefined

    protected constructor(address: c.Address, init?: { code: c.Cell, data: c.Cell }) {
        this.address = address;
        this.init = init;
    }

    static fromAddress(address: c.Address) {
        return new fossFiWallet(address);
    }

    static fromStorage(emptyStorage: {
        jettonBalance?: coins /* = 0 */
        goldCoins?: uint32 /* = 1 */
        id?: string /* = "" */
        txnCount?: uint8 /* = 0 */
        status?: uint2 /* = 0 */
        isAuthorityAccount?: boolean /* = false */
        creditNeed?: coins /* = 0 */
        accumulatedFees?: coins /* = 0 */
        debt?: coins /* = 0 */
        debts?: boolean /* = false */
        votes?: uint4 /* = 10 */
        receivedVotes?: uint20 /* = 0 */
        connections?: uint8 /* = 0 */
        active?: boolean /* = false */
        mintable?: boolean /* = true */
        version?: uint10 /* = 0 */
        storeVersion?: uint10 /* = 0 */
        timestamps: CellRef<TimeStamps>
        addresses: CellRef<Addresses>
        maps: CellRef<Maps>
    }, deployedOptions?: DeployedAddrOptions) {
        const initialState = {
            code: deployedOptions?.overrideContractCode ?? fossFiWallet.CodeCell,
            data: FiWalletStore.toCell(FiWalletStore.create(emptyStorage)),
        };
        const address = calculateDeployedAddress(initialState.code, initialState.data, deployedOptions ?? {});
        return new fossFiWallet(address, initialState);
    }

    static createCellOfAskToTransfer(body: {
        queryId: uint64
        jettonAmount: coins
        transferRecipient: c.Address
        sendExcessesTo: c.Address | null
        customPayload: c.Cell | null
        forwardTonAmount: coins
        forwardPayload: ForwardPayloadRemainder
    }) {
        return AskToTransfer.toCell(AskToTransfer.create(body));
    }

    static createCellOfAskToBurn(body: {
        queryId: uint64
        jettonAmount: coins
        sendExcessesTo: c.Address | null
        customPayload: c.Cell | null
    }) {
        return AskToBurn.toCell(AskToBurn.create(body));
    }

    static createCellOfAuthorityAction(body: {
        sender: c.Address
    }) {
        return AuthorityAction.toCell(AuthorityAction.create(body));
    }

    static createCellOfInternalTransferStep(body: {
        queryId: uint64
        jettonAmount: coins
        version: uint10
        transferredAsCredit?: boolean /* = false */
        transferInitiator: c.Address
        sendExcessesTo: c.Address | null
        forwardTonAmount: coins
        forwardPayload: ForwardPayloadRemainder
    }) {
        return InternalTransferStep.toCell(InternalTransferStep.create(body));
    }

    static createCellOfInternalInvite(body: {
        queryId?: uint64 /* = 0 */
        version: uint10
        sender: c.Address
        invitor: c.Address
        currentWalletCode: c.Cell
        currentStorage: c.Cell | null
        id: string
    }) {
        return InternalInvite.toCell(InternalInvite.create(body));
    }

    static createCellOfInternalDeActivate(body: {
    }) {
        return InternalDeActivate.toCell(InternalDeActivate.create());
    }

    static createCellOfOthersActions(body: {
        queryId: uint64
        jettonAmount: coins
        transferRecipient: c.Address
        sendExcessesTo: c.Address | null
        customPayload: c.Cell | null
        forwardTonAmount: coins
        forwardPayload: string
    }) {
        return OthersActions.toCell(OthersActions.create(body));
    }

    static createCellOfPayback(body: {
        queryId: uint64
        amount: coins
        sender: c.Address
    }) {
        return Payback.toCell(Payback.create(body));
    }

    static createCellOfRequestUpgradeCode(body: {
        sender: c.Address
        version: uint10
    }) {
        return RequestUpgradeCode.toCell(RequestUpgradeCode.create(body));
    }

    static createCellOfSetStatus(body: {
        sender: c.Address
        status: uint2
    }) {
        return SetStatus.toCell(SetStatus.create(body));
    }

    static createCellOfTopUpTons(body: {
        queryId: uint64
    }) {
        return TopUpTons.toCell(TopUpTons.create(body));
    }

    static createCellOfTransferNotificationForRecipient(body: {
        queryId: uint64
        jettonAmount: coins
        transferInitiator: c.Address
        forwardPayload: ForwardPayloadRemainder
    }) {
        return TransferNotificationForRecipient.toCell(TransferNotificationForRecipient.create(body));
    }

    static createCellOfUpgrade(body: {
        walletUpgrade?: boolean /* = true */
        walletVersion: uint10
        sender: c.Address
        newData?: c.Cell | null /* = null */
        newCode?: c.Cell | null /* = null */
    }) {
        return Upgrade.toCell(Upgrade.create(body));
    }

    static createCellOfVotingAction(body: {
        positiveVote?: boolean /* = true */
        count?: uint4 /* = 10 */
        sender: c.Address
    }) {
        return VotingAction.toCell(VotingAction.create(body));
    }

    static createCellOfEnterLottery(body: {
        sender: c.Address
        amount: coins
    }) {
        return EnterLottery.toCell(EnterLottery.create(body));
    }

    static createCellOfUnFollow(body: {
        queryId: uint64
        follow: boolean
        followee: c.Address
    }) {
        return UnFollow.toCell(UnFollow.create(body));
    }

    static createCellOfUnFollowInternal(body: {
        queryId: uint64
        follow: boolean
        sender: c.Address
    }) {
        return UnFollowInternal.toCell(UnFollowInternal.create(body));
    }

    static createCellOfDestroy(body: {
    }) {
        return Destroy.toCell(Destroy.create());
    }

    async sendDeploy(provider: ContractProvider, via: Sender, msgValue: coins, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: c.Cell.EMPTY,
            ...extraOptions
        });
    }

    async sendAskToTransfer(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        queryId: uint64
        jettonAmount: coins
        transferRecipient: c.Address
        sendExcessesTo: c.Address | null
        customPayload: c.Cell | null
        forwardTonAmount: coins
        forwardPayload: ForwardPayloadRemainder
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: AskToTransfer.toCell(AskToTransfer.create(body)),
            ...extraOptions
        });
    }

    async sendAskToBurn(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        queryId: uint64
        jettonAmount: coins
        sendExcessesTo: c.Address | null
        customPayload: c.Cell | null
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: AskToBurn.toCell(AskToBurn.create(body)),
            ...extraOptions
        });
    }

    async sendAuthorityAction(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        sender: c.Address
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: AuthorityAction.toCell(AuthorityAction.create(body)),
            ...extraOptions
        });
    }

    async sendInternalTransferStep(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        queryId: uint64
        jettonAmount: coins
        version: uint10
        transferredAsCredit?: boolean /* = false */
        transferInitiator: c.Address
        sendExcessesTo: c.Address | null
        forwardTonAmount: coins
        forwardPayload: ForwardPayloadRemainder
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: InternalTransferStep.toCell(InternalTransferStep.create(body)),
            ...extraOptions
        });
    }

    async sendInternalInvite(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        queryId?: uint64 /* = 0 */
        version: uint10
        sender: c.Address
        invitor: c.Address
        currentWalletCode: c.Cell
        currentStorage: c.Cell | null
        id: string
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: InternalInvite.toCell(InternalInvite.create(body)),
            ...extraOptions
        });
    }

    async sendInternalDeActivate(provider: ContractProvider, via: Sender, msgValue: coins, body: {
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: InternalDeActivate.toCell(InternalDeActivate.create()),
            ...extraOptions
        });
    }

    async sendOthersActions(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        queryId: uint64
        jettonAmount: coins
        transferRecipient: c.Address
        sendExcessesTo: c.Address | null
        customPayload: c.Cell | null
        forwardTonAmount: coins
        forwardPayload: string
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: OthersActions.toCell(OthersActions.create(body)),
            ...extraOptions
        });
    }

    async sendPayback(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        queryId: uint64
        amount: coins
        sender: c.Address
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: Payback.toCell(Payback.create(body)),
            ...extraOptions
        });
    }

    async sendRequestUpgradeCode(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        sender: c.Address
        version: uint10
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: RequestUpgradeCode.toCell(RequestUpgradeCode.create(body)),
            ...extraOptions
        });
    }

    async sendSetStatus(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        sender: c.Address
        status: uint2
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetStatus.toCell(SetStatus.create(body)),
            ...extraOptions
        });
    }

    async sendTopUpTons(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        queryId: uint64
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: TopUpTons.toCell(TopUpTons.create(body)),
            ...extraOptions
        });
    }

    async sendTransferNotificationForRecipient(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        queryId: uint64
        jettonAmount: coins
        transferInitiator: c.Address
        forwardPayload: ForwardPayloadRemainder
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: TransferNotificationForRecipient.toCell(TransferNotificationForRecipient.create(body)),
            ...extraOptions
        });
    }

    async sendUpgrade(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        walletUpgrade?: boolean /* = true */
        walletVersion: uint10
        sender: c.Address
        newData?: c.Cell | null /* = null */
        newCode?: c.Cell | null /* = null */
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: Upgrade.toCell(Upgrade.create(body)),
            ...extraOptions
        });
    }

    async sendVotingAction(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        positiveVote?: boolean /* = true */
        count?: uint4 /* = 10 */
        sender: c.Address
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: VotingAction.toCell(VotingAction.create(body)),
            ...extraOptions
        });
    }

    async sendEnterLottery(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        sender: c.Address
        amount: coins
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: EnterLottery.toCell(EnterLottery.create(body)),
            ...extraOptions
        });
    }

    async sendUnFollow(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        queryId: uint64
        follow: boolean
        followee: c.Address
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: UnFollow.toCell(UnFollow.create(body)),
            ...extraOptions
        });
    }

    async sendUnFollowInternal(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        queryId: uint64
        follow: boolean
        sender: c.Address
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: UnFollowInternal.toCell(UnFollowInternal.create(body)),
            ...extraOptions
        });
    }

    async sendDestroy(provider: ContractProvider, via: Sender, msgValue: coins, body: {
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: Destroy.toCell(Destroy.create()),
            ...extraOptions
        });
    }

    async getWalletData(provider: ContractProvider): Promise<JettonWalletDataReply> {
        const r = StackReader.fromGetMethod(4, await provider.get('get_wallet_data', []));
        return ({
            $: 'JettonWalletDataReply',
            jettonBalance: r.readBigInt(),
            ownerAddress: r.readSlice().loadAddress(),
            minterAddress: r.readSlice().loadAddress(),
            jettonWalletCode: r.readCell(),
        });
    }

    async getWalletDataAll(provider: ContractProvider): Promise<FiWalletStore> {
        const r = StackReader.fromGetMethod(20, await provider.get('get_wallet_data_all', []));
        return ({
            $: 'FiWalletStore',
            jettonBalance: r.readBigInt(),
            goldCoins: r.readBigInt(),
            id: r.readSnakeString(),
            txnCount: r.readBigInt(),
            status: r.readBigInt(),
            isAuthorityAccount: r.readBoolean(),
            creditNeed: r.readBigInt(),
            accumulatedFees: r.readBigInt(),
            debt: r.readBigInt(),
            debts: r.readBoolean(),
            votes: r.readBigInt(),
            receivedVotes: r.readBigInt(),
            connections: r.readBigInt(),
            active: r.readBoolean(),
            mintable: r.readBoolean(),
            version: r.readBigInt(),
            storeVersion: r.readBigInt(),
            timestamps: r.readCellRef<TimeStamps>(TimeStamps.fromSlice),
            addresses: r.readCellRef<Addresses>(Addresses.fromSlice),
            maps: r.readCellRef<Maps>(Maps.fromSlice),
        });
    }

    async getId(provider: ContractProvider): Promise<string> {
        const r = StackReader.fromGetMethod(1, await provider.get('get_id', []));
        return r.readSnakeString();
    }
}
