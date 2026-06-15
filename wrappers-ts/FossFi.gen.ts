// AUTO-GENERATED, do not edit
// It's a TypeScript wrapper for a fossFi contract in Tolk.
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

    readNullable<T>(readFn_T: (r: StackReader) => T): T | null {
        if (this.tuple[0].type === 'null') {
            this.tuple.shift();
            return null;
        }
        return readFn_T(this);
    }

    readWideNullable<T>(stackW: number, readFn_T: (r: StackReader) => T): T | null {
        const slotTypeId = this.tuple[stackW - 1];
        if (slotTypeId?.type !== 'int') {
            throw new Error(`not 'int' on a stack`);
        }
        if (slotTypeId.value === 0n) {
            this.tuple = this.tuple.slice(stackW);
            return null;
        }
        const valueT = readFn_T(this);
        this.tuple.shift();
        return valueT;
    }

    readCellRef<T>(loadFn_T: LoadCallback<T>): CellRef<T> {
        return { ref: loadFn_T(this.readCell().beginParse()) };
    }
}

// ————————————————————————————————————————————
//   auto-generated serializers to/from cells
//

type coins = bigint

type uint10 = bigint
type uint32 = bigint
type uint64 = bigint
type uint256 = bigint

/**
 > struct FiCodes {
 >     lotteryCode: cell?
 >     latestFiWalletCode: cell?
 >     c: cell?
 >     d: cell?
 > }
 */
export interface FiCodes {
    readonly $: 'FiCodes'
    lotteryCode: c.Cell | null
    latestFiWalletCode: c.Cell | null
    c: c.Cell | null
    d: c.Cell | null
}

export const FiCodes = {
    create(args: {
        lotteryCode: c.Cell | null
        latestFiWalletCode: c.Cell | null
        c: c.Cell | null
        d: c.Cell | null
    }): FiCodes {
        return {
            $: 'FiCodes',
            ...args
        }
    },
    fromSlice(s: c.Slice): FiCodes {
        return {
            $: 'FiCodes',
            lotteryCode: s.loadBoolean() ? s.loadRef() : null,
            latestFiWalletCode: s.loadBoolean() ? s.loadRef() : null,
            c: s.loadBoolean() ? s.loadRef() : null,
            d: s.loadBoolean() ? s.loadRef() : null,
        }
    },
    store(self: FiCodes, b: c.Builder): void {
        storeTolkNullable<c.Cell>(self.lotteryCode, b,
            (v,b) => b.storeRef(v)
        );
        storeTolkNullable<c.Cell>(self.latestFiWalletCode, b,
            (v,b) => b.storeRef(v)
        );
        storeTolkNullable<c.Cell>(self.c, b,
            (v,b) => b.storeRef(v)
        );
        storeTolkNullable<c.Cell>(self.d, b,
            (v,b) => b.storeRef(v)
        );
    },
    toCell(self: FiCodes): c.Cell {
        return makeCellFrom<FiCodes>(self, FiCodes.store);
    }
}

/**
 > struct FiStore {
 >     supply: coins
 >     walletVersion: uint10
 >     admin: address
 >     currentRequest: CurrentRequest?
 >     metadata: cell
 >     others: Cell<FiCodes>
 > }
 */
export interface FiStore {
    readonly $: 'FiStore'
    supply: coins
    walletVersion: uint10
    admin: c.Address
    currentRequest: CurrentRequest | null
    metadata: c.Cell
    others: CellRef<FiCodes>
}

export const FiStore = {
    create(args: {
        supply: coins
        walletVersion: uint10
        admin: c.Address
        currentRequest: CurrentRequest | null
        metadata: c.Cell
        others: CellRef<FiCodes>
    }): FiStore {
        return {
            $: 'FiStore',
            ...args
        }
    },
    fromSlice(s: c.Slice): FiStore {
        return {
            $: 'FiStore',
            supply: s.loadCoins(),
            walletVersion: s.loadUintBig(10),
            admin: s.loadAddress(),
            currentRequest: s.loadBoolean() ? CurrentRequest.fromSlice(s) : null,
            metadata: s.loadRef(),
            others: loadCellRef<FiCodes>(s, FiCodes.fromSlice),
        }
    },
    store(self: FiStore, b: c.Builder): void {
        b.storeCoins(self.supply);
        b.storeUint(self.walletVersion, 10);
        b.storeAddress(self.admin);
        storeTolkNullable<CurrentRequest>(self.currentRequest, b, CurrentRequest.store);
        b.storeRef(self.metadata);
        storeCellRef<FiCodes>(self.others, b, FiCodes.store);
    },
    toCell(self: FiStore): c.Cell {
        return makeCellFrom<FiStore>(self, FiStore.store);
    }
}

/**
 > struct JettonDataReply {
 >     totalSupply: int
 >     mintable: bool
 >     adminAddress: address?
 >     jettonContent: Cell<OnchainMetadataReply>
 >     jettonWalletCode: cell
 > }
 */
export interface JettonDataReply {
    readonly $: 'JettonDataReply'
    totalSupply: bigint
    mintable: boolean
    adminAddress: c.Address | null
    jettonContent: CellRef<OnchainMetadataReply>
    jettonWalletCode: c.Cell
}

export const JettonDataReply = {
    create(args: {
        totalSupply: bigint
        mintable: boolean
        adminAddress: c.Address | null
        jettonContent: CellRef<OnchainMetadataReply>
        jettonWalletCode: c.Cell
    }): JettonDataReply {
        return {
            $: 'JettonDataReply',
            ...args
        }
    },
    fromSlice(s: c.Slice): JettonDataReply {
        throw new Error(`Can't unpack 'JettonDataReply' from cell, because 'JettonDataReply.totalSupply' is 'int' (not int32/uint64/etc.)`);
    },
    store(self: JettonDataReply, b: c.Builder): void {
        throw new Error(`Can't pack 'JettonDataReply' to cell, because 'self.totalSupply' is 'int' (not int32/uint64/etc.)`);
    },
    toCell(self: JettonDataReply): c.Cell {
        return makeCellFrom<JettonDataReply>(self, JettonDataReply.store);
    }
}

/**
 > struct (0x00) OnchainMetadataReply {
 >     contentDict: map<uint256, Cell<SnakeDataReply>>
 > }
 */
export interface OnchainMetadataReply {
    readonly $: 'OnchainMetadataReply'
    contentDict: c.Dictionary<uint256, CellRef<SnakeDataReply>>
}

export const OnchainMetadataReply = {
    PREFIX: 0x00,

    create(args: {
        contentDict: c.Dictionary<uint256, CellRef<SnakeDataReply>>
    }): OnchainMetadataReply {
        return {
            $: 'OnchainMetadataReply',
            ...args
        }
    },
    fromSlice(s: c.Slice): OnchainMetadataReply {
        loadAndCheckPrefix(s, 0x00, 8, 'OnchainMetadataReply');
        return {
            $: 'OnchainMetadataReply',
            contentDict: c.Dictionary.load<uint256, CellRef<SnakeDataReply>>(c.Dictionary.Keys.BigUint(256), createDictionaryValue<CellRef<SnakeDataReply>>(
                (s) => loadCellRef<SnakeDataReply>(s, SnakeDataReply.fromSlice),
                (v,b) => storeCellRef<SnakeDataReply>(v, b, SnakeDataReply.store)
            ), s),
        }
    },
    store(self: OnchainMetadataReply, b: c.Builder): void {
        b.storeUint(0x00, 8);
        b.storeDict<uint256, CellRef<SnakeDataReply>>(self.contentDict, c.Dictionary.Keys.BigUint(256), createDictionaryValue<CellRef<SnakeDataReply>>(
            (s) => loadCellRef<SnakeDataReply>(s, SnakeDataReply.fromSlice),
            (v,b) => storeCellRef<SnakeDataReply>(v, b, SnakeDataReply.store)
        ));
    },
    toCell(self: OnchainMetadataReply): c.Cell {
        return makeCellFrom<OnchainMetadataReply>(self, OnchainMetadataReply.store);
    }
}

/**
 > struct (0x00) SnakeDataReply {
 >     string: string
 > }
 */
export interface SnakeDataReply {
    readonly $: 'SnakeDataReply'
    string: string
}

export const SnakeDataReply = {
    PREFIX: 0x00,

    create(args: {
        string: string
    }): SnakeDataReply {
        return {
            $: 'SnakeDataReply',
            ...args
        }
    },
    fromSlice(s: c.Slice): SnakeDataReply {
        loadAndCheckPrefix(s, 0x00, 8, 'SnakeDataReply');
        return {
            $: 'SnakeDataReply',
            string: s.loadStringRefTail(),
        }
    },
    store(self: SnakeDataReply, b: c.Builder): void {
        b.storeUint(0x00, 8);
        b.storeStringRefTail(self.string);
    },
    toCell(self: SnakeDataReply): c.Cell {
        return makeCellFrom<SnakeDataReply>(self, SnakeDataReply.store);
    }
}

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
 > struct (0x2c76b973) RequestWalletAddress {
 >     queryId: uint64
 >     owner: address
 >     includeOwnerAddress: bool
 > }
 */
export interface RequestWalletAddress {
    readonly $: 'RequestWalletAddress'
    queryId: uint64
    owner: c.Address
    includeOwnerAddress: boolean
}

export const RequestWalletAddress = {
    PREFIX: 0x2c76b973,

    create(args: {
        queryId: uint64
        owner: c.Address
        includeOwnerAddress: boolean
    }): RequestWalletAddress {
        return {
            $: 'RequestWalletAddress',
            ...args
        }
    },
    fromSlice(s: c.Slice): RequestWalletAddress {
        loadAndCheckPrefix32(s, 0x2c76b973, 'RequestWalletAddress');
        return {
            $: 'RequestWalletAddress',
            queryId: s.loadUintBig(64),
            owner: s.loadAddress(),
            includeOwnerAddress: s.loadBoolean(),
        }
    },
    store(self: RequestWalletAddress, b: c.Builder): void {
        b.storeUint(0x2c76b973, 32);
        b.storeUint(self.queryId, 64);
        b.storeAddress(self.owner);
        b.storeBit(self.includeOwnerAddress);
    },
    toCell(self: RequestWalletAddress): c.Cell {
        return makeCellFrom<RequestWalletAddress>(self, RequestWalletAddress.store);
    }
}

/**
 > struct (0xd1735400) ResponseWalletAddress {
 >     queryId: uint64
 >     jettonWalletAddress: address?
 >     owner: Cell<address>?
 > }
 */
export interface ResponseWalletAddress {
    readonly $: 'ResponseWalletAddress'
    queryId: uint64
    jettonWalletAddress: c.Address | null
    owner: CellRef<c.Address> | null
}

export const ResponseWalletAddress = {
    PREFIX: 0xd1735400,

    create(args: {
        queryId: uint64
        jettonWalletAddress: c.Address | null
        owner: CellRef<c.Address> | null
    }): ResponseWalletAddress {
        return {
            $: 'ResponseWalletAddress',
            ...args
        }
    },
    fromSlice(s: c.Slice): ResponseWalletAddress {
        loadAndCheckPrefix32(s, 0xd1735400, 'ResponseWalletAddress');
        return {
            $: 'ResponseWalletAddress',
            queryId: s.loadUintBig(64),
            jettonWalletAddress: s.loadMaybeAddress(),
            owner: s.loadBoolean() ? loadCellRef<c.Address>(s,
                (s) => s.loadAddress()
            ) : null,
        }
    },
    store(self: ResponseWalletAddress, b: c.Builder): void {
        b.storeUint(0xd1735400, 32);
        b.storeUint(self.queryId, 64);
        b.storeAddress(self.jettonWalletAddress);
        storeTolkNullable<CellRef<c.Address>>(self.owner, b,
            (v,b) => { storeCellRef<c.Address>(v, b,
                (v,b) => b.storeAddress(v)
            ); }
        );
    },
    toCell(self: ResponseWalletAddress): c.Cell {
        return makeCellFrom<ResponseWalletAddress>(self, ResponseWalletAddress.store);
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
 > struct (0x6501f354) ChangeMinterAdmin {
 >     queryId: uint64
 >     newAdminAddress: address
 > }
 */
export interface ChangeMinterAdmin {
    readonly $: 'ChangeMinterAdmin'
    queryId: uint64
    newAdminAddress: c.Address
}

export const ChangeMinterAdmin = {
    PREFIX: 0x6501f354,

    create(args: {
        queryId: uint64
        newAdminAddress: c.Address
    }): ChangeMinterAdmin {
        return {
            $: 'ChangeMinterAdmin',
            ...args
        }
    },
    fromSlice(s: c.Slice): ChangeMinterAdmin {
        loadAndCheckPrefix32(s, 0x6501f354, 'ChangeMinterAdmin');
        return {
            $: 'ChangeMinterAdmin',
            queryId: s.loadUintBig(64),
            newAdminAddress: s.loadAddress(),
        }
    },
    store(self: ChangeMinterAdmin, b: c.Builder): void {
        b.storeUint(0x6501f354, 32);
        b.storeUint(self.queryId, 64);
        b.storeAddress(self.newAdminAddress);
    },
    toCell(self: ChangeMinterAdmin): c.Cell {
        return makeCellFrom<ChangeMinterAdmin>(self, ChangeMinterAdmin.store);
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
 > struct (0xcb862902) ChangeMinterMetadataUri {
 >     queryId: uint64
 >     newMetadataUri: cell
 > }
 */
export interface ChangeMinterMetadataUri {
    readonly $: 'ChangeMinterMetadataUri'
    queryId: uint64
    newMetadataUri: c.Cell
}

export const ChangeMinterMetadataUri = {
    PREFIX: 0xcb862902,

    create(args: {
        queryId: uint64
        newMetadataUri: c.Cell
    }): ChangeMinterMetadataUri {
        return {
            $: 'ChangeMinterMetadataUri',
            ...args
        }
    },
    fromSlice(s: c.Slice): ChangeMinterMetadataUri {
        loadAndCheckPrefix32(s, 0xcb862902, 'ChangeMinterMetadataUri');
        return {
            $: 'ChangeMinterMetadataUri',
            queryId: s.loadUintBig(64),
            newMetadataUri: s.loadRef(),
        }
    },
    store(self: ChangeMinterMetadataUri, b: c.Builder): void {
        b.storeUint(0xcb862902, 32);
        b.storeUint(self.queryId, 64);
        b.storeRef(self.newMetadataUri);
    },
    toCell(self: ChangeMinterMetadataUri): c.Cell {
        return makeCellFrom<ChangeMinterMetadataUri>(self, ChangeMinterMetadataUri.store);
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
 > struct (0x00000013) HotUpgrade {
 >     additionalData: cell?
 >     code: cell
 > }
 */
export interface HotUpgrade {
    readonly $: 'HotUpgrade'
    additionalData: c.Cell | null
    code: c.Cell
}

export const HotUpgrade = {
    PREFIX: 0x00000013,

    create(args: {
        additionalData: c.Cell | null
        code: c.Cell
    }): HotUpgrade {
        return {
            $: 'HotUpgrade',
            ...args
        }
    },
    fromSlice(s: c.Slice): HotUpgrade {
        loadAndCheckPrefix32(s, 0x00000013, 'HotUpgrade');
        return {
            $: 'HotUpgrade',
            additionalData: s.loadBoolean() ? s.loadRef() : null,
            code: s.loadRef(),
        }
    },
    store(self: HotUpgrade, b: c.Builder): void {
        b.storeUint(0x00000013, 32);
        storeTolkNullable<c.Cell>(self.additionalData, b,
            (v,b) => b.storeRef(v)
        );
        b.storeRef(self.code);
    },
    toCell(self: HotUpgrade): c.Cell {
        return makeCellFrom<HotUpgrade>(self, HotUpgrade.store);
    }
}

/**
 > struct CurrentRequest {
 >     newUpgrade: Upgrade
 >     timestamp: uint32
 > }
 */
export interface CurrentRequest {
    readonly $: 'CurrentRequest'
    newUpgrade: Upgrade
    timestamp: uint32
}

export const CurrentRequest = {
    create(args: {
        newUpgrade: Upgrade
        timestamp: uint32
    }): CurrentRequest {
        return {
            $: 'CurrentRequest',
            ...args
        }
    },
    fromSlice(s: c.Slice): CurrentRequest {
        return {
            $: 'CurrentRequest',
            newUpgrade: Upgrade.fromSlice(s),
            timestamp: s.loadUintBig(32),
        }
    },
    store(self: CurrentRequest, b: c.Builder): void {
        Upgrade.store(self.newUpgrade, b);
        b.storeUint(self.timestamp, 32);
    },
    toCell(self: CurrentRequest): c.Cell {
        return makeCellFrom<CurrentRequest>(self, CurrentRequest.store);
    }
}

/**
 > struct (0x00000011) ApproveUpgrade {
 > }
 */
export interface ApproveUpgrade {
    readonly $: 'ApproveUpgrade'
}

export const ApproveUpgrade = {
    PREFIX: 0x00000011,

    create(): ApproveUpgrade {
        return {
            $: 'ApproveUpgrade',
        }
    },
    fromSlice(s: c.Slice): ApproveUpgrade {
        loadAndCheckPrefix32(s, 0x00000011, 'ApproveUpgrade');
        return {
            $: 'ApproveUpgrade',
        }
    },
    store(self: ApproveUpgrade, b: c.Builder): void {
        b.storeUint(0x00000011, 32);
    },
    toCell(self: ApproveUpgrade): c.Cell {
        return makeCellFrom<ApproveUpgrade>(self, ApproveUpgrade.store);
    }
}

/**
 > struct (0x00000012) RejectUpgrade {
 > }
 */
export interface RejectUpgrade {
    readonly $: 'RejectUpgrade'
}

export const RejectUpgrade = {
    PREFIX: 0x00000012,

    create(): RejectUpgrade {
        return {
            $: 'RejectUpgrade',
        }
    },
    fromSlice(s: c.Slice): RejectUpgrade {
        loadAndCheckPrefix32(s, 0x00000012, 'RejectUpgrade');
        return {
            $: 'RejectUpgrade',
        }
    },
    store(self: RejectUpgrade, b: c.Builder): void {
        b.storeUint(0x00000012, 32);
    },
    toCell(self: RejectUpgrade): c.Cell {
        return makeCellFrom<RejectUpgrade>(self, RejectUpgrade.store);
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
 > struct (0x22222222) LotteryWin {
 >     entryAmount: coins
 >     amt: coins
 >     winner: address
 > }
 */
export interface LotteryWin {
    readonly $: 'LotteryWin'
    entryAmount: coins
    amt: coins
    winner: c.Address
}

export const LotteryWin = {
    PREFIX: 0x22222222,

    create(args: {
        entryAmount: coins
        amt: coins
        winner: c.Address
    }): LotteryWin {
        return {
            $: 'LotteryWin',
            ...args
        }
    },
    fromSlice(s: c.Slice): LotteryWin {
        loadAndCheckPrefix32(s, 0x22222222, 'LotteryWin');
        return {
            $: 'LotteryWin',
            entryAmount: s.loadCoins(),
            amt: s.loadCoins(),
            winner: s.loadAddress(),
        }
    },
    store(self: LotteryWin, b: c.Builder): void {
        b.storeUint(0x22222222, 32);
        b.storeCoins(self.entryAmount);
        b.storeCoins(self.amt);
        b.storeAddress(self.winner);
    },
    toCell(self: LotteryWin): c.Cell {
        return makeCellFrom<LotteryWin>(self, LotteryWin.store);
    }
}

// ————————————————————————————————————————————
//    class fossFi
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

export class fossFi implements c.Contract {
    static CodeCell = c.Cell.fromBase64('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');

    static Errors = {
        'Errors.NotValidWallet': 74,
        'Errors.NotOwner': 100,
        'Errors.IncorrectSender': 700,
        'Errors.IncorrectReceiver': 708,
        'Errors.WaitMore': 735,
    }

    readonly address: c.Address
    readonly init: { code: c.Cell, data: c.Cell } | undefined

    protected constructor(address: c.Address, init?: { code: c.Cell, data: c.Cell }) {
        this.address = address;
        this.init = init;
    }

    static fromAddress(address: c.Address) {
        return new fossFi(address);
    }

    static fromStorage(emptyStorage: {
        supply: coins
        walletVersion: uint10
        admin: c.Address
        currentRequest: CurrentRequest | null
        metadata: c.Cell
        others: CellRef<FiCodes>
    }, deployedOptions?: DeployedAddrOptions) {
        const initialState = {
            code: deployedOptions?.overrideContractCode ?? fossFi.CodeCell,
            data: FiStore.toCell(FiStore.create(emptyStorage)),
        };
        const address = calculateDeployedAddress(initialState.code, initialState.data, deployedOptions ?? {});
        return new fossFi(address, initialState);
    }

    static createCellOfMintNewJettons(body: {
        queryId: uint64
        mintRecipient: c.Address
        tonAmount: coins
        internalTransferMsg: CellRef<InternalTransferStep>
    }) {
        return MintNewJettons.toCell(MintNewJettons.create(body));
    }

    static createCellOfNotifyMinter(body: {
        queryId: uint64
        jettonAmount: coins
        burnInitiator: c.Address
        sendExcessesTo: c.Address | null
    }) {
        return NotifyMinter.toCell(NotifyMinter.create(body));
    }

    static createCellOfRequestWalletAddress(body: {
        queryId: uint64
        owner: c.Address
        includeOwnerAddress: boolean
    }) {
        return RequestWalletAddress.toCell(RequestWalletAddress.create(body));
    }

    static createCellOfChangeMinterAdmin(body: {
        queryId: uint64
        newAdminAddress: c.Address
    }) {
        return ChangeMinterAdmin.toCell(ChangeMinterAdmin.create(body));
    }

    static createCellOfChangeMinterMetadataUri(body: {
        queryId: uint64
        newMetadataUri: c.Cell
    }) {
        return ChangeMinterMetadataUri.toCell(ChangeMinterMetadataUri.create(body));
    }

    static createCellOfTopUpTons(body: {
        queryId: uint64
    }) {
        return TopUpTons.toCell(TopUpTons.create(body));
    }

    static createCellOfInformMinterInviteInternal(body: {
        queryId: uint64
        sender: c.Address
        invitor: c.Address
        id: string
    }) {
        return InformMinterInviteInternal.toCell(InformMinterInviteInternal.create(body));
    }

    static createCellOfRequestUpgradeCode(body: {
        sender: c.Address
        version: uint10
    }) {
        return RequestUpgradeCode.toCell(RequestUpgradeCode.create(body));
    }

    static createCellOfEnterLottery(body: {
        sender: c.Address
        amount: coins
    }) {
        return EnterLottery.toCell(EnterLottery.create(body));
    }

    static createCellOfLotteryWin(body: {
        entryAmount: coins
        amt: coins
        winner: c.Address
    }) {
        return LotteryWin.toCell(LotteryWin.create(body));
    }

    static createCellOfHotUpgrade(body: {
        additionalData: c.Cell | null
        code: c.Cell
    }) {
        return HotUpgrade.toCell(HotUpgrade.create(body));
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

    static createCellOfRejectUpgrade(body: {
    }) {
        return RejectUpgrade.toCell(RejectUpgrade.create());
    }

    static createCellOfApproveUpgrade(body: {
    }) {
        return ApproveUpgrade.toCell(ApproveUpgrade.create());
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

    async sendMintNewJettons(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        queryId: uint64
        mintRecipient: c.Address
        tonAmount: coins
        internalTransferMsg: CellRef<InternalTransferStep>
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: MintNewJettons.toCell(MintNewJettons.create(body)),
            ...extraOptions
        });
    }

    async sendNotifyMinter(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        queryId: uint64
        jettonAmount: coins
        burnInitiator: c.Address
        sendExcessesTo: c.Address | null
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: NotifyMinter.toCell(NotifyMinter.create(body)),
            ...extraOptions
        });
    }

    async sendRequestWalletAddress(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        queryId: uint64
        owner: c.Address
        includeOwnerAddress: boolean
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: RequestWalletAddress.toCell(RequestWalletAddress.create(body)),
            ...extraOptions
        });
    }

    async sendChangeMinterAdmin(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        queryId: uint64
        newAdminAddress: c.Address
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: ChangeMinterAdmin.toCell(ChangeMinterAdmin.create(body)),
            ...extraOptions
        });
    }

    async sendChangeMinterMetadataUri(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        queryId: uint64
        newMetadataUri: c.Cell
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: ChangeMinterMetadataUri.toCell(ChangeMinterMetadataUri.create(body)),
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

    async sendInformMinterInviteInternal(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        queryId: uint64
        sender: c.Address
        invitor: c.Address
        id: string
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: InformMinterInviteInternal.toCell(InformMinterInviteInternal.create(body)),
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

    async sendLotteryWin(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        entryAmount: coins
        amt: coins
        winner: c.Address
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: LotteryWin.toCell(LotteryWin.create(body)),
            ...extraOptions
        });
    }

    async sendHotUpgrade(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        additionalData: c.Cell | null
        code: c.Cell
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: HotUpgrade.toCell(HotUpgrade.create(body)),
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

    async sendRejectUpgrade(provider: ContractProvider, via: Sender, msgValue: coins, body: {
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: RejectUpgrade.toCell(RejectUpgrade.create()),
            ...extraOptions
        });
    }

    async sendApproveUpgrade(provider: ContractProvider, via: Sender, msgValue: coins, body: {
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: ApproveUpgrade.toCell(ApproveUpgrade.create()),
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

    async getJettonData(provider: ContractProvider): Promise<JettonDataReply> {
        const r = StackReader.fromGetMethod(5, await provider.get('get_jetton_data', []));
        return ({
            $: 'JettonDataReply',
            totalSupply: r.readBigInt(),
            mintable: r.readBoolean(),
            adminAddress: r.readNullable<c.Address>(
                (r) => r.readSlice().loadAddress()
            ),
            jettonContent: r.readCellRef<OnchainMetadataReply>(OnchainMetadataReply.fromSlice),
            jettonWalletCode: r.readCell(),
        });
    }

    async getJettonDataAll(provider: ContractProvider): Promise<FiStore> {
        const r = StackReader.fromGetMethod(12, await provider.get('get_jetton_data_all', []));
        return ({
            $: 'FiStore',
            supply: r.readBigInt(),
            walletVersion: r.readBigInt(),
            admin: r.readSlice().loadAddress(),
            currentRequest: r.readWideNullable<CurrentRequest>(7,
                (r) => ({
                    $: 'CurrentRequest',
                    newUpgrade: ({
                        $: 'Upgrade',
                        walletUpgrade: r.readBoolean(),
                        walletVersion: r.readBigInt(),
                        sender: r.readSlice().loadAddress(),
                        newData: r.readNullable<c.Cell>(
                            (r) => r.readCell()
                        ),
                        newCode: r.readNullable<c.Cell>(
                            (r) => r.readCell()
                        ),
                    }),
                    timestamp: r.readBigInt(),
                })
            ),
            metadata: r.readCell(),
            others: r.readCellRef<FiCodes>(FiCodes.fromSlice),
        });
    }

    async getWalletAddress(provider: ContractProvider, owner: c.Address): Promise<c.Address> {
        const r = StackReader.fromGetMethod(1, await provider.get('get_wallet_address', [
            { type: 'slice', cell: makeCellFrom<c.Address>(owner,
                (v,b) => b.storeAddress(v)
            ) },
        ]));
        return r.readSlice().loadAddress();
    }
}
