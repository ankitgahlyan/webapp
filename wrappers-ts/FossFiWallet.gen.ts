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

function formatPrefix(prefixNum: number, prefixLen: number): string {
    return prefixLen % 4 ? `0b${prefixNum.toString(2).padStart(prefixLen, '0')}` : `0x${prefixNum.toString(16).padStart(prefixLen / 4, '0')}`;
}

function loadAndCheckPrefix(s: c.Slice, expected: number, prefixLen: number, structName: string): void {
    let prefix = s.loadUint(prefixLen);
    if (prefix !== expected) {
        throw new Error(`Incorrect prefix for '${structName}': expected ${formatPrefix(expected, prefixLen)}, got ${formatPrefix(prefix, prefixLen)}`);
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
 > struct (0b0) PayloadInline {
 >     value: RemainingBitsAndRefs
 > }
 */
export interface PayloadInline {
    readonly $: 'PayloadInline'
    value: RemainingBitsAndRefs
}

export const PayloadInline = {
    PREFIX: 0b0,

    create(args: {
        value: RemainingBitsAndRefs
    }): PayloadInline {
        return {
            $: 'PayloadInline',
            ...args
        }
    },
    fromSlice(s: c.Slice): PayloadInline {
        loadAndCheckPrefix(s, 0b0, 1, 'PayloadInline');
        return {
            $: 'PayloadInline',
            value: loadTolkRemaining(s),
        }
    },
    store(self: PayloadInline, b: c.Builder): void {
        b.storeUint(0b0, 1);
        storeTolkRemaining(self.value, b);
    },
    toCell(self: PayloadInline): c.Cell {
        return makeCellFrom<PayloadInline>(self, PayloadInline.store);
    }
}

/**
 > struct (0b1) PayloadInRef {
 >     value: Cell<RemainingBitsAndRefs>
 > }
 */
export interface PayloadInRef {
    readonly $: 'PayloadInRef'
    value: CellRef<RemainingBitsAndRefs>
}

export const PayloadInRef = {
    PREFIX: 0b1,

    create(args: {
        value: CellRef<RemainingBitsAndRefs>
    }): PayloadInRef {
        return {
            $: 'PayloadInRef',
            ...args
        }
    },
    fromSlice(s: c.Slice): PayloadInRef {
        loadAndCheckPrefix(s, 0b1, 1, 'PayloadInRef');
        return {
            $: 'PayloadInRef',
            value: loadCellRef<RemainingBitsAndRefs>(s, loadTolkRemaining),
        }
    },
    store(self: PayloadInRef, b: c.Builder): void {
        b.storeUint(0b1, 1);
        storeCellRef<RemainingBitsAndRefs>(self.value, b, storeTolkRemaining);
    },
    toCell(self: PayloadInRef): c.Cell {
        return makeCellFrom<PayloadInRef>(self, PayloadInRef.store);
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
    forwardPayload: PayloadInline | PayloadInRef
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
        forwardPayload: PayloadInline | PayloadInRef
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
            forwardPayload: lookupPrefix(s, 0b0, 1) ? PayloadInline.fromSlice(s) :
                lookupPrefix(s, 0b1, 1) ? PayloadInRef.fromSlice(s) :
                throwNonePrefixMatch('AskToTransfer.forwardPayload'),
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
        switch (self.forwardPayload.$) {
            case 'PayloadInline':
                PayloadInline.store(self.forwardPayload, b);
                break;
            case 'PayloadInRef':
                PayloadInRef.store(self.forwardPayload, b);
                break;
        }
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
    forwardPayload: PayloadInline | PayloadInRef
}

export const TransferNotificationForRecipient = {
    PREFIX: 0x7362d09c,

    create(args: {
        queryId: uint64
        jettonAmount: coins
        transferInitiator: c.Address
        forwardPayload: PayloadInline | PayloadInRef
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
            forwardPayload: lookupPrefix(s, 0b0, 1) ? PayloadInline.fromSlice(s) :
                lookupPrefix(s, 0b1, 1) ? PayloadInRef.fromSlice(s) :
                throwNonePrefixMatch('TransferNotificationForRecipient.forwardPayload'),
        }
    },
    store(self: TransferNotificationForRecipient, b: c.Builder): void {
        b.storeUint(0x7362d09c, 32);
        b.storeUint(self.queryId, 64);
        b.storeCoins(self.jettonAmount);
        b.storeAddress(self.transferInitiator);
        switch (self.forwardPayload.$) {
            case 'PayloadInline':
                PayloadInline.store(self.forwardPayload, b);
                break;
            case 'PayloadInRef':
                PayloadInRef.store(self.forwardPayload, b);
                break;
        }
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
    forwardPayload: PayloadInline | PayloadInRef
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
        forwardPayload: PayloadInline | PayloadInRef
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
            forwardPayload: lookupPrefix(s, 0b0, 1) ? PayloadInline.fromSlice(s) :
                lookupPrefix(s, 0b1, 1) ? PayloadInRef.fromSlice(s) :
                throwNonePrefixMatch('InternalTransferStep.forwardPayload'),
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
        switch (self.forwardPayload.$) {
            case 'PayloadInline':
                PayloadInline.store(self.forwardPayload, b);
                break;
            case 'PayloadInRef':
                PayloadInRef.store(self.forwardPayload, b);
                break;
        }
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
 > }
 */
export interface TopUpTons {
    readonly $: 'TopUpTons'
}

export const TopUpTons = {
    PREFIX: 0xd372158c,

    create(): TopUpTons {
        return {
            $: 'TopUpTons',
        }
    },
    fromSlice(s: c.Slice): TopUpTons {
        loadAndCheckPrefix32(s, 0xd372158c, 'TopUpTons');
        return {
            $: 'TopUpTons',
        }
    },
    store(self: TopUpTons, b: c.Builder): void {
        b.storeUint(0xd372158c, 32);
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
 >     baseFiWalletCode: cell
 >     nomInAddrs: Cell<NomInAddrs>
 >     trustedJettonAddrs: Cell<TrustedAddrs>
 > }
 */
export interface Addresses {
    readonly $: 'Addresses'
    owner: c.Address
    treasury: c.Address
    baseFiWalletCode: c.Cell
    nomInAddrs: CellRef<NomInAddrs>
    trustedJettonAddrs: CellRef<TrustedAddrs>
}

export const Addresses = {
    create(args: {
        owner: c.Address
        treasury: c.Address
        baseFiWalletCode: c.Cell
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
            baseFiWalletCode: s.loadRef(),
            nomInAddrs: loadCellRef<NomInAddrs>(s, NomInAddrs.fromSlice),
            trustedJettonAddrs: loadCellRef<TrustedAddrs>(s, TrustedAddrs.fromSlice),
        }
    },
    store(self: Addresses, b: c.Builder): void {
        b.storeAddress(self.owner);
        b.storeAddress(self.treasury);
        b.storeRef(self.baseFiWalletCode);
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
    static CodeCell = c.Cell.fromBase64('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');

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
        forwardPayload: PayloadInline | PayloadInRef
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
        forwardPayload: PayloadInline | PayloadInRef
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
    }) {
        return TopUpTons.toCell(TopUpTons.create());
    }

    static createCellOfTransferNotificationForRecipient(body: {
        queryId: uint64
        jettonAmount: coins
        transferInitiator: c.Address
        forwardPayload: PayloadInline | PayloadInRef
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
        forwardPayload: PayloadInline | PayloadInRef
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
        forwardPayload: PayloadInline | PayloadInRef
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
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: TopUpTons.toCell(TopUpTons.create()),
            ...extraOptions
        });
    }

    async sendTransferNotificationForRecipient(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        queryId: uint64
        jettonAmount: coins
        transferInitiator: c.Address
        forwardPayload: PayloadInline | PayloadInRef
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
