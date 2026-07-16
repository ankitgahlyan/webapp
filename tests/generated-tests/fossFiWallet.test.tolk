import "@stdlib/gas-payments"
import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
import "@wrappers/FossFiWallet.gen"
import "@contracts/common/messages"
import "@contracts/followers/messages"
import "@contracts/lottery/messages"

/// Example test case demonstrating the basic flow
get fun `test basic flow`() {
    val (contract, deployer, notDeployer) = setupTest();
    // TODO: Implement your test logic here
    // Example:
    // val res = contract.sendMsg(deployer.address, ...);
    // expect(res).toHaveTransaction({ ... });
}

/// Initializes the test environment, creating a fresh instance of the contract.
/// Returns the contract wrapper and two treasury accounts (`deployer` and `notDeployer`).
fun setupTest(): (FossFiWallet, Treasury, Treasury) {
    // Create a treasury account for deployment (typically the owner)
    val deployer = testing.treasury("deployer");
    // Create another treasury account for testing interactions from other users
    val notDeployer = testing.treasury("notDeployer");

    // Initialize and deploy the contract with default values
    val contract = FossFiWallet.fromStorage({ jettonBalance: 0, goldCoins: 0, id: "", txnCount: 0, status: 0, isAuthorityAccount: false, creditNeed: 0, accumulatedFees: 0, debt: 0, debts: false, votes: 0, receivedVotes: 0, connections: 0, active: false, mintable: false, version: 0, storeVersion: 0, timestamps: TimeStamps {
            accountInit: 0,
            lastInvite: 0,
            lastClaim: 0,
        }.toCell(), addresses: Addresses {
            owner: address("EQD__________________________________________0vo"),
            treasury: address("EQD__________________________________________0vo"),
            baseFiWalletCode: createEmptyCell(),
            nomInAddrs: NomInAddrs {
                nominee: null,
                invitor: null,
                invitor0: null,
            }.toCell(),
            trustedJettonAddrs: TrustedAddrs {
                minterAddr: address("EQD__________________________________________0vo"),
                personalJettonMinter: null,
                personalJettonWallet: null,
                authorisedAccs: [],
            }.toCell(),
        }.toCell(), maps: Maps {
            invited: [],
            allowances: [],
            votedFor: [],
            reportInfo: ReportInfo {
                reports: [],
                tosBreach: false,
                reporterCount: 0,
                disputerCount: 0,
                reportResolutionTime: 0,
            }.toCell(),
        }.toCell() });
    val res = contract.deploy(deployer.address, { value: ton("1") });
    expect(res).toHaveSuccessfulDeploy({ to: contract.address });

    return (contract, deployer, notDeployer);
}
