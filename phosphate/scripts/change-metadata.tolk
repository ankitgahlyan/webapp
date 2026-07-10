import "@acton/emulation/network"
import "@acton/emulation/scripts"
import "@wrappers/FossFi.gen"
import "utils/common"

fun main() {
    val admin = promptJettonWallet("JETTON_ADMIN", "Select Jetton Admin ActonWallet");
    val minter = promptJettonMinter("Enter Jetton Minter address");
    val metadata = promptJettonMetadata(JETTON_DEFAULT_DESCRIPTION);

    val res = minter.sendChangeMinterMetadataUri(
        admin.address,
        0,
        buildJettonMetadataCell(metadata),
    );
    res.waitForFirstTransaction();

    printJettonMinterInfo(minter, "JETTON");
}
