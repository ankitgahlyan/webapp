import "@stdlib/tvm-lowlevel"
import "@gen/fossFiWallet.code"
import "@contracts/common/messages"
import "@contracts/common/sharding"
import "@contracts/common/types"
import "@contracts/lottery/messages"
import "@contracts/lottery/storage"
import "jetton-utils"
import "storage"

type AllowedMessageToMinter =
    | MintNewJettons
    | NotifyMinter
    | RequestWalletAddress
    | ChangeMinterAdmin
    | ChangeMinterMetadataUri
    | TopUpTons
    | InformMinterInviteInternal
    | RequestUpgradeCode
    | EnterLottery
    | LotteryWin
    | HotUpgrade
    | Upgrade
    | RejectUpgrade
    | ApproveUpgrade
    | Destroy

contract fossFi {
    author: "zeta"
    version: "0.1.0"
    description: "minter contract for fossFi with personal token, voting, invite system and more"
    storage: FiStore
    incomingMessages: AllowedMessageToMinter
}

fun onInternalMessage(in: InMessage): void {
    val msg = lazy AllowedMessageToMinter.fromSlice(in.body);
    var store = lazy FiStore.load();
    var others = lazy store.others.load();

    match (msg) {
        InformMinterInviteInternal => {
            // note: use notifyMinter but forwardPayload?
            checkCorrectSender(in.senderAddress, msg.sender, store);
            store.totalAccounts += 1;
            store.supply += MBRP_AMOUNT; // note: broadcast id for explorers or dbs

            // send excesses
            val excesses = createMessage({
                bounce: BounceMode.NoBounce,
                value: 0,
                dest: msg.sender,
                body: ReturnExcessesBack { queryId: msg.queryId },
            });
            excesses.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_IGNORE_ERRORS);
        }

        NotifyMinter => {
            checkCorrectSender(in.senderAddress, msg.burnInitiator, store);

            // determine whether MINT or BURN
            msg.queryId != 0 ? store.supply += msg.jettonAmount : store.supply -= msg.jettonAmount;

            if (msg.sendExcessesTo == null) {
                return;
            }

            val excessesMsg = createMessage({
                bounce: BounceMode.NoBounce,
                dest: msg.sendExcessesTo,
                value: 0,
                body: ReturnExcessesBack { queryId: msg.queryId },
            });
            excessesMsg.send(SEND_MODE_IGNORE_ERRORS | SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);
        }

        RequestWalletAddress => {
            val owner: Cell<address>? = msg.includeOwnerAddress ? msg.owner.toCell() : null;

            var walletAddress: address? = null;
            if (msg.owner.getWorkchain() == MY_WORKCHAIN) {
                walletAddress = calcDeployFiWallet(
                    msg.owner,
                    store.admin,
                    contract.getAddress(),
                    fossFiWalletCompiledCode(),
                ).calculateAddress();
            }

            val respondMsg = createMessage({
                bounce: BounceMode.NoBounce,
                dest: in.senderAddress,
                value: 0,
                body: ResponseWalletAddress {
                    queryId: msg.queryId,
                    jettonWalletAddress: walletAddress,
                    owner,
                },
            });
            respondMsg.send(
                SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL,
            );
        }

        MintNewJettons => {
            assert (false) throw Errors.IncorrectReceiver; // just for fun/standard
        }

        ChangeMinterAdmin => {
            assert (in.senderAddress == store.admin) throw Errors.NotOwner;
            store.admin = msg.newAdminAddress;
        }

        ChangeMinterMetadataUri => {
            assert (in.senderAddress == store.admin) throw Errors.NotOwner;
            store.metadata = msg.newMetadataUri;
        }

        Upgrade => {
            assert (in.senderAddress == store.admin) throw Errors.IncorrectSender;
            assert (store.currentRequest == null) throw Errors.WaitMore;

            store.currentRequest = { newUpgrade: msg, timestamp: blockchain.now() };
        }

        RejectUpgrade => {
            assert (in.senderAddress == store.admin) throw Errors.IncorrectSender;
            assert (store.currentRequest != null) throw Errors.WaitMore; // todo: better error code

            store.currentRequest = null;
        }

        ApproveUpgrade => {
            assert (in.senderAddress == store.admin) throw Errors.IncorrectSender;
            // todo: redundant check (why would admin do this?)
            assert (store.currentRequest != null) throw Errors.WaitMore;
            // testnetOnly, wait period is over
            assert (store.currentRequest.timestamp + 1 < blockchain.now()) throw Errors.WaitMore;

            val code = store.currentRequest.newUpgrade.newCode;
            val data = store.currentRequest.newUpgrade.newData;

            match (store.currentRequest.newUpgrade.walletUpgrade) {
                true => {
                    // for jettonWallet of FOSSFIAT/MINT
                    store.walletVersion += 1;
                    others.latestFiWalletCode = code!; // shouldn't be null for other than minterUpgrade
                    // todo: remove on mainnet to keep contracts deployer agnostic
                    val upgradeMsg = createMessage({
                        bounce: BounceMode.NoBounce,
                        value: 0,
                        dest: calcDeployFiWallet(
                            in.senderAddress,
                            store.admin,
                            // owner/deployer/treasury all same here
                            contract.getAddress(),
                            fossFiWalletCompiledCode(),
                        ).calculateAddress(),
                        body: Upgrade {
                            walletVersion: store.walletVersion,
                            sender: store.admin, // or use contract.getAddress()
                            newData: data,
                            newCode: code,
                        },
                    });
                    upgradeMsg.send(
                        SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_IGNORE_ERRORS,
                    );
                }

                false => {
                    // for minter
                    if (code != null) {
                        contract.setCodePostponed(code);
                    }

                    if (data != null) {
                        contract.setData(data);
                    }
                }
            }

            store.currentRequest = null;
        }

        RequestUpgradeCode => {
            checkCorrectSender(in.senderAddress, msg.sender, store);
            if (msg.version < store.walletVersion) {
                // sendUpgradeMinter(in.senderAddress, store);
                val upgradeMsg = createMessage({
                    // bounce for collecting fees back
                    bounce: BounceMode.NoBounce,
                    value: 0,
                    dest: in.senderAddress,
                    body: Upgrade {
                        walletVersion: store.walletVersion,
                        sender: store.admin,
                        newCode: others.latestFiWalletCode!,
                    },
                });
                upgradeMsg.send(
                    SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_IGNORE_ERRORS,
                );
            }
        }

        TopUpTons => {
            // deploy + accept tons + deploy jettonWallet
            if (in.senderAddress == store.admin) {
                store.supply += ton("1");
                val deployTopUpMsg = createMessage({
                    // bounce for collecting fees back
                    bounce: BounceMode.Only256BitsOfBody,
                    value: 0,
                    dest: calcDeployFiWallet(
                        in.senderAddress,
                        in.senderAddress,
                        contract.getAddress(),
                        fossFiWalletCompiledCode(),
                    ),
                    body: TopUpTons {},
                });
                deployTopUpMsg.send(
                    SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL,
                );
            }
        }

        EnterLottery => {
            checkCorrectSender(in.senderAddress, msg.sender, store);
            val enterMsg = createMessage({
                bounce: BounceMode.RichBounce, // todo handle deepBounces
                value: 0,
                dest: calcDeployLottery(
                    // deploy
                    contract.getAddress(),
                    msg.amount,
                    others.lotteryCode!, // todo: fixme, should not be null for entering lottery
                ),
                body: msg,
            });
            enterMsg.send(
                SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE | SEND_MODE_BOUNCE_ON_ACTION_FAIL,
            );
        }

        LotteryWin => {
            assert (
                in.senderAddress ==
                calcDeployLottery(
                    contract.getAddress(),
                    msg.entryAmount,
                    others.lotteryCode!,
                ).calculateAddress()
            ) throw Errors.IncorrectSender;
            // todo:
            // send using InternalTransfer/Mint
        }

        HotUpgrade => {
            assert (in.senderAddress == store.admin) throw Errors.IncorrectSender;

            contract.setCodePostponed(msg.code);

            // SAFETY
            setTvmRegisterC3(transformSliceToContinuation(msg.code.beginParse()));
            hotUpgradeFiData(msg.additionalData);
        }

        // testnetOnly
        Destroy => {
            assert (in.senderAddress == store.admin) throw Errors.IncorrectSender;

            val destroy = createMessage({
                bounce: BounceMode.NoBounce,
                value: 0,
                dest: in.senderAddress,
                body: ReturnExcessesBack { queryId: 0 },
            });
            // safety: send all balance back to admin and then destroy
            destroy.send(SEND_MODE_CARRY_ALL_BALANCE | SEND_MODE_DESTROY);
        }

        else => {
            // invalid input; a typical reaction is:
            // ignore empty messages, "wrong opcode" if not
            assert (in.body.isEmpty()) throw 0xFFFF;
        }
    }
    store.others = others.toCell();
    store.save();
}

get fun get_jetton_data(): JettonDataReply {
    val store = lazy FiStore.load();

    // var metadata: OnchainMetadataReply = { contentDict: createEmptyMap() };
    // // if (store.metadata != null) {
    // metadata.contentDict.set(
    //     stringSha256("uri"),
    //     SnakeDataReply { string: store.metadata.load() }.toCell()
    // );
    // metadata.contentDict.set(stringSha256("decimals"), SnakeDataReply { string: "9" }.toCell());
    // // }
    return {
        totalSupply: store.supply,
        mintable: true,                                              // but by peers only & not minter
        adminAddress: store.admin,
        jettonContent: store.metadata as Cell<OnchainMetadataReply>, // metadata.toCell(),
        jettonWalletCode: fossFiWalletCompiledCode(),
    };
}

get fun get_jetton_data_all(): FiStore {
    return FiStore.load(); // todo: return contract code + data also
}

get fun get_wallet_address(owner: address): address {
    val store = lazy FiStore.load();
    return calcDeployFiWallet(
        owner,
        store.admin,
        // owner/deployer/treasury
        contract.getAddress(),
        fossFiWalletCompiledCode(),
    ).calculateAddress();
}

fun checkCorrectSender(sender: address, owner: address, store: FiStore): void {
    assert (
        sender ==
        calcDeployFiWallet(
            owner,
            store.admin,
            contract.getAddress(),
            fossFiWalletCompiledCode(),
        ).calculateAddress()
    ) throw Errors.NotValidWallet;
}

// todo: implement minter deploy(efficient) not jetton(costly stateinit send)
// todo: implement bouncing-lottery also for gamification of network
fun calcDeployLottery(
    owner: address,
    entryAmount: coins,
    lotteryCode: cell, // todo: fixme,,,
): AutoDeployAddress {
    val emptyLotteryStore: LotteryStorage = {
        owner,
        entryAmount,
        participants: [],
    };

    return { stateInit: { code: lotteryCode, data: emptyLotteryStore.toCell() } };
}

@method_id(2121)
fun hotUpgradeFiData(_additionalData: cell?) {
    // var oldStorage = lazy FiStore.fromCell(contract.getData());
    // assert (additionalData != null) throw Errors.1112;
    // var storage = FiStore {
    //     supply: oldStorage.totalSupply,
    //     walletVersion: oldStorage.walletVersion,
    //     admin: oldStorage.adminAddress,
    //     baseFiWalletCode: oldStorage.baseFiWalletCode,
    //     metadata: oldStorage.metadata,
    //     others: oldStorage.others,
    // };
    // contract.setData(storage.toCell());
}
