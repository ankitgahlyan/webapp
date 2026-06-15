// AUTO-GENERATED, do not edit
// It's a TypeScript wrapper for a SomebodyHelpMePlsBruhhh contract in Tolk.
/* eslint-disable */

import * as c from '@ton/core';
import { beginCell, ContractProvider, Sender, SendMode } from '@ton/core';

// ————————————————————————————————————————————
//   predefined types and functions
//

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

function storeTolkNullable<T>(v: T | null, b: c.Builder, storeFn_T: StoreCallback<T>): void {
    if (v === null) {
        b.storeUint(0, 1);
    } else {
        b.storeUint(1, 1);
        storeFn_T(v, b);
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

    readDictionary<K extends c.DictionaryKeyTypes, V>(keySerializer: c.DictionaryKey<K>, valueSerializer: c.DictionaryValue<V>): c.Dictionary<K, V> {
        if (this.tuple[0].type === 'null') {
            this.tuple.shift();
            return c.Dictionary.empty<K, V>(keySerializer, valueSerializer);
        }
        return c.Dictionary.loadDirect<K, V>(keySerializer, valueSerializer, this.readCell());
    }
}

// ————————————————————————————————————————————
//   auto-generated serializers to/from cells
//

type coins = bigint

type uint8 = bigint
type uint22 = bigint
type uint64 = bigint
type uint256 = bigint

/**
 > struct RecoveryStorage {
 >     owner: address
 >     nextPkey: uint256
 >     trusty: map<address, bool>
 >     trustyCount: uint8
 >     vouchedCount: uint8
 >     recoveryTime: uint64
 >     minWaitInterval: uint22
 > }
 */
export interface RecoveryStorage {
    readonly $: 'RecoveryStorage'
    owner: c.Address
    nextPkey: uint256
    trusty: c.Dictionary<c.Address, boolean>
    trustyCount: uint8
    vouchedCount: uint8
    recoveryTime: uint64
    minWaitInterval: uint22
}

export const RecoveryStorage = {
    create(args: {
        owner: c.Address
        nextPkey: uint256
        trusty: c.Dictionary<c.Address, boolean>
        trustyCount: uint8
        vouchedCount: uint8
        recoveryTime: uint64
        minWaitInterval: uint22
    }): RecoveryStorage {
        return {
            $: 'RecoveryStorage',
            ...args
        }
    },
    fromSlice(s: c.Slice): RecoveryStorage {
        return {
            $: 'RecoveryStorage',
            owner: s.loadAddress(),
            nextPkey: s.loadUintBig(256),
            trusty: c.Dictionary.load<c.Address, boolean>(c.Dictionary.Keys.Address(), c.Dictionary.Values.Bool(), s),
            trustyCount: s.loadUintBig(8),
            vouchedCount: s.loadUintBig(8),
            recoveryTime: s.loadUintBig(64),
            minWaitInterval: s.loadUintBig(22),
        }
    },
    store(self: RecoveryStorage, b: c.Builder): void {
        b.storeAddress(self.owner);
        b.storeUint(self.nextPkey, 256);
        b.storeDict<c.Address, boolean>(self.trusty, c.Dictionary.Keys.Address(), c.Dictionary.Values.Bool());
        b.storeUint(self.trustyCount, 8);
        b.storeUint(self.vouchedCount, 8);
        b.storeUint(self.recoveryTime, 64);
        b.storeUint(self.minWaitInterval, 22);
    },
    toCell(self: RecoveryStorage): c.Cell {
        return makeCellFrom<RecoveryStorage>(self, RecoveryStorage.store);
    }
}

// ————————————————————————————————————————————
//    class SomebodyHelpMePlsBruhhh
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

export class SomebodyHelpMePlsBruhhh implements c.Contract {
    static CodeCell = c.Cell.fromBase64('te6ccgECBwEAAToAART/APSkE/S88sgLAQIBYgIDA/jQ+JGRMODXLCAAAAAEl9IA+kiBAIGOPNcsIAAAAAyf0gDTAAGS0/+SbQHigQCCjiLXLCAAAAAUlW1tgQCDjhDXLCAAAAAckvI/4W1tgQCE4kEw4uIB0e1E0PpI0//0BNMH0wfTPyDXCxWBAIEpuuMPA8j6UhLL//QAywcTBAUGACmgXivaiaH0kaf/6AmmD6YPpn+mK6MALjA3N/iSJccF8uK8IcF/8uB/B5GkkaXiANaBAIIpuo44OPiSJYEBC/QKb6Ex8uK8+JeCElQL5AC88uK/IZI3N5oxNPgjUAagBgMF4viSCMjKAECDgQEL9EGOKDA4OIEAg1AGup4yMzT4kiHHBfLivHBTAJr4Iye88uLfRmYE4kFmBQTiAQAQywfLP87J7VQ=');

    static Errors = {
        'MAX_CONNECTIONS': 127,
        'INCORRECT_SENDER': 700,
        'INSUFFICIENT_GAS_SENT': 703,
        'WAIT_MORE': 735,
    }

    readonly address: c.Address
    readonly init: { code: c.Cell, data: c.Cell } | undefined

    protected constructor(address: c.Address, init?: { code: c.Cell, data: c.Cell }) {
        this.address = address;
        this.init = init;
    }

    static fromAddress(address: c.Address) {
        return new SomebodyHelpMePlsBruhhh(address);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, msgValue: coins, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: c.Cell.EMPTY,
            ...extraOptions
        });
    }

    async getState(provider: ContractProvider): Promise<RecoveryStorage> {
        const r = StackReader.fromGetMethod(7, await provider.get('state', []));
        return ({
            $: 'RecoveryStorage',
            owner: r.readSlice().loadAddress(),
            nextPkey: r.readBigInt(),
            trusty: r.readDictionary<c.Address, boolean>(c.Dictionary.Keys.Address(), c.Dictionary.Values.Bool()),
            trustyCount: r.readBigInt(),
            vouchedCount: r.readBigInt(),
            recoveryTime: r.readBigInt(),
            minWaitInterval: r.readBigInt(),
        });
    }
}
