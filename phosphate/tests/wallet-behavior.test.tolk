import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
import "@acton/types/transaction"
import "@wrappers/FossFiWallet.gen"
import "@wrappers/utils"
import "@contracts/common/messages"
import "@contracts/common/types"
import "test-utils"
import "@wrappers/FossFi.gen"
import "@acton/build"
import "@contracts/fossFi/storage"

get fun `test wallet: owner can send jettons`() {
    val (minter, senderWallet, deployer, notDeployer) = setupTest();
    val transferAmount = ton("100");
    val receiverWallet = userWallet(minter, notDeployer.address);

    expect(senderWallet.getJettonBalance()).toEqual(ton("1"));

    val invite = senderWallet.sendOthersActions(
        deployer.address,
        0,
        ton("0.1"),                            // invite
        notDeployer.address,
        deployer.address,
        null,
        DEFAULT_FORWARD_TON_AMOUNT,
        "username@lat,long",
        { value: DEFAULT_TRANSFER_MSG_VALUE }, // todo: bounce?
    );

    expect(invite).toHaveSuccessfulDeploy<InternalInvite>({
        from: senderWallet.address,
        to: receiverWallet.address,
    });

    expect(senderWallet.getJettonBalance()).toEqual(ton("1000"));
    expect(receiverWallet.getJettonBalance()).toEqual(ton("1"));

    val res = senderWallet.sendTransferPayloadInline(
        deployer.address,
        DEFAULT_TRANSFER_MSG_VALUE,
        transferAmount,
        notDeployer.address,
        deployer.address,
        null,
        DEFAULT_FORWARD_TON_AMOUNT,
        createEmptySlice(),
    );

    expect(res).toHaveSuccessfulTx<AskToTransfer>({
        from: deployer.address,
        to: senderWallet.address,
    });

    expect(senderWallet.getJettonBalance()).toEqual(ton("900"));
    expect(receiverWallet.getJettonBalance()).toEqual(transferAmount + ton("1"));

    // upgrades test
    val newCode = build("fossFiWallet");
    val upg= minter.sendUpgrade(
        deployer.address,
        true,
        0,
        deployer.address,
        null,
        newCode
    );

    val minterDataAll = minter.getJettonDataAll();
    expect(minterDataAll.currentRequest!.newUpgrade.walletUpgrade).toBeTrue();
}

get fun `test wallet: non-owner cannot send jettons`() {
    val (minter, wallet, deployer, notDeployer) = setupTest();
    // val wallet = mintTo(minter, deployer, deployer.address, ton("7"));
    val balanceBefore = wallet.getJettonBalance();

    val res = wallet.sendTransferPayloadInline(
        notDeployer.address,
        DEFAULT_TRANSFER_MSG_VALUE,
        ton("3"),
        notDeployer.address,
        deployer.address,
        null,
        DEFAULT_FORWARD_TON_AMOUNT,
        createEmptySlice(),
    );
    expect(res).toHaveFailedTx<AskToTransfer>({
        from: notDeployer.address,
        to: wallet.address,
        exitCode: Errors.NotOwner,
    });

    expect(wallet.getJettonBalance()).toEqual(balanceBefore);
}

get fun `test wallet: cannot send more jettons than balance`() {
    val (minter, wallet, deployer, notDeployer) = setupTest();
    // val wallet = mintTo(minter, deployer, deployer.address, ton("2"));
    val balanceBefore = wallet.getJettonBalance();

    val res = wallet.sendTransferPayloadInline(
        deployer.address,
        DEFAULT_TRANSFER_MSG_VALUE,
        ton("5"),
        notDeployer.address,
        deployer.address,
        null,
        DEFAULT_FORWARD_TON_AMOUNT,
        createEmptySlice(),
    );
    expect(res).toHaveFailedTx<AskToTransfer>({
        from: deployer.address,
        to: wallet.address,
        exitCode: Errors.BalanceError,
    });

    expect(wallet.getJettonBalance()).toEqual(balanceBefore);
}

get fun `test wallet: zero forward ton means no transfer notification`() {
    val (minter, senderWallet, deployer, notDeployer) = setupTest();
    // val senderWallet = mintTo(minter, deployer, deployer.address, ton("2"));
    val receiverWallet = userWallet(minter, notDeployer.address);

    val res = senderWallet.sendTransferPayloadInline(
        deployer.address,
        DEFAULT_TRANSFER_MSG_VALUE,
        ton("1"),
        notDeployer.address,
        deployer.address,
        null,
        0,
        createEmptySlice(),
    );
    expect(res).toHaveSuccessfulTx<AskToTransfer>({
        from: deployer.address,
        to: senderWallet.address,
    });
    expect(res).toNotHaveTx<TransferNotificationForRecipient>({
        from: receiverWallet.address,
        to: notDeployer.address,
    });
}

get fun `test wallet: transfer notification should preserve forward payload`() {
    val (minter, senderWallet, deployer, notDeployer) = setupTest();
    // val senderWallet = mintTo(minter, deployer, deployer.address, ton("2"));
    val receiverWallet = userWallet(minter, notDeployer.address);
    val sentAmount = ton("0.5");
    val forwardPayload = beginCell().storeUint(0x1234567890abcdef, 128).endCell();

    val res = senderWallet.sendTransferPayloadInRef(
        deployer.address,
        DEFAULT_TRANSFER_MSG_VALUE,
        sentAmount,
        notDeployer.address,
        deployer.address,
        null,
        DEFAULT_FORWARD_TON_AMOUNT,
        forwardPayload,
    );
    expect(res).toHaveSuccessfulTx<AskToTransfer>({
        from: deployer.address,
        to: senderWallet.address,
    });

    val notificationTx = res.findTransaction<TransferNotificationForRecipient>({
        from: receiverWallet.address,
        to: notDeployer.address,
        success: true,
        exitCode: 0,
    });
    expect(notificationTx).toBeNotNull();

    val notification = notificationTx!.loadBody<TransferNotificationForRecipient>();
    var payloadSlice = notification.forwardPayload;
    val payloadRef = payloadSlice.loadMaybeRef();
    expect(payloadRef).toBeNotNull();
    if (payloadRef == null) {
        return;
    }

    var payloadBody = payloadRef.beginParse();
    if (
        payloadBody.remainingBitsCount() == 1 && payloadBody.preloadUint(1) == 1 &&
        payloadBody.remainingRefsCount() == 1
    ) {
        payloadBody.loadUint(1);
        expect(payloadBody.loadRef().hash()).toEqual(forwardPayload.hash());
    } else {
        expect(payloadRef.hash()).toEqual(forwardPayload.hash());
    }
}

get fun `test wallet: transfer to undeployed recipient wallet should still work`() {
    val (minter, senderWallet, deployer, _) = setupTest();
    // val senderWallet = mintTo(minter, deployer, deployer.address, ton("2"));
    val recipientOwner = randomAddress();
    val recipientWallet = userWallet(minter, recipientOwner);
    val sentAmount = ton("0.5");

    val res = senderWallet.sendTransferPayloadInline(
        deployer.address,
        DEFAULT_TRANSFER_MSG_VALUE,
        sentAmount,
        recipientOwner,
        deployer.address,
        null,
        0,
        createEmptySlice(),
    );

    expect(res).toHaveAllSuccessfulTxs();
    expect(res).toHaveSuccessfulTx<AskToTransfer>({
        from: deployer.address,
        to: senderWallet.address,
    });
    expect(recipientWallet.getJettonBalance()).toEqual(sentAmount);
}

get fun `test wallet: owner can burn jettons`() {
    val (minter, wallet, deployer, _) = setupTest();
    val burnAmount = ton("3");
    // val wallet = mintTo(minter, deployer, deployer.address, ton("10"));
    val supplyBefore = minter.getTotalSupply();

    val res = wallet.sendBurn(
        deployer.address,
        DEFAULT_BURN_MSG_VALUE,
        burnAmount,
        deployer.address,
        null,
    );
    expect(res).toHaveSuccessfulTx<AskToBurn>({ from: deployer.address, to: wallet.address });

    expect(wallet.getJettonBalance()).toEqual(ton("7"));
    expect(minter.getTotalSupply()).toEqual(supplyBefore - burnAmount);
}

get fun `test wallet: non-owner cannot burn jettons`() {
    val (minter, wallet, deployer, notDeployer) = setupTest();
    // val wallet = mintTo(minter, deployer, deployer.address, ton("6"));
    val balanceBefore = wallet.getJettonBalance();
    val supplyBefore = minter.getTotalSupply();

    val res = wallet.sendBurn(
        notDeployer.address,
        DEFAULT_BURN_MSG_VALUE,
        ton("2"),
        deployer.address,
        null,
    );
    expect(res).toHaveFailedTx<AskToBurn>({
        from: notDeployer.address,
        to: wallet.address,
        exitCode: Errors.NotOwner,
    });

    expect(wallet.getJettonBalance()).toEqual(balanceBefore);
    expect(minter.getTotalSupply()).toEqual(supplyBefore);
}

get fun `test wallet: cannot burn more jettons than balance`() {
    val (minter, wallet, deployer, _) = setupTest();
    // val wallet = mintTo(minter, deployer, deployer.address, ton("1"));
    val balanceBefore = wallet.getJettonBalance();
    val supplyBefore = minter.getTotalSupply();

    val res = wallet.sendBurn(
        deployer.address,
        DEFAULT_BURN_MSG_VALUE,
        ton("5"),
        deployer.address,
        null,
    );
    expect(res).toHaveFailedTx<AskToBurn>({
        from: deployer.address,
        to: wallet.address,
        exitCode: Errors.BalanceError,
    });

    expect(wallet.getJettonBalance()).toEqual(balanceBefore);
    expect(minter.getTotalSupply()).toEqual(supplyBefore);
}
