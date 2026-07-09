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
type uint33 = bigint
type uint64 = bigint
type uint256 = bigint

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
 >     totalAccounts: uint33
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
    totalAccounts: uint33 /* = 0 */
    supply: coins /* = 0 */
    walletVersion: uint10 /* = 0 */
    admin: c.Address
    currentRequest: CurrentRequest | null /* = null */
    metadata: c.Cell
    others: CellRef<FiCodes>
}

export const FiStore = {
    create(args: {
        totalAccounts?: uint33 /* = 0 */
        supply?: coins /* = 0 */
        walletVersion?: uint10 /* = 0 */
        admin: c.Address
        currentRequest?: CurrentRequest | null /* = null */
        metadata: c.Cell
        others: CellRef<FiCodes>
    }): FiStore {
        return {
            $: 'FiStore',
            totalAccounts: 0n,
            supply: 0n,
            walletVersion: 0n,
            currentRequest: null,
            ...args
        }
    },
    fromSlice(s: c.Slice): FiStore {
        return {
            $: 'FiStore',
            totalAccounts: s.loadUintBig(33),
            supply: s.loadCoins(),
            walletVersion: s.loadUintBig(10),
            admin: s.loadAddress(),
            currentRequest: s.loadBoolean() ? CurrentRequest.fromSlice(s) : null,
            metadata: s.loadRef(),
            others: loadCellRef<FiCodes>(s, FiCodes.fromSlice),
        }
    },
    store(self: FiStore, b: c.Builder): void {
        b.storeUint(self.totalAccounts, 33);
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
        totalAccounts?: uint33 /* = 0 */
        supply?: coins /* = 0 */
        walletVersion?: uint10 /* = 0 */
        admin: c.Address
        currentRequest?: CurrentRequest | null /* = null */
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
    }) {
        return TopUpTons.toCell(TopUpTons.create());
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
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: TopUpTons.toCell(TopUpTons.create()),
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
        const r = StackReader.fromGetMethod(13, await provider.get('get_jetton_data_all', []));
        return ({
            $: 'FiStore',
            totalAccounts: r.readBigInt(),
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
