import "@stdlib/gas-payments"
import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"
import "@wrappers/FossFi.gen"
import "@contracts/common/messages"
import "@contracts/lottery/messages"
import "@contracts/fossFi/storage"

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
fun setupTest(): (FossFi, Treasury, Treasury) {
    // Create a treasury account for deployment (typically the owner)
    val deployer = testing.treasury("deployer");
    // Create another treasury account for testing interactions from other users
    val notDeployer = testing.treasury("notDeployer");

    // Initialize and deploy the contract with default values
    val contract = FossFi.fromStorage({ totalAccounts: 0, supply: 0, walletVersion: 0, admin: deployer.address, currentRequest: null, metadata: createEmptyCell(), others: FiCodes {
            lotteryCode: null,
            latestFiWalletCode: null,
            c: null,
            d: null,
        }.toCell() });
    val res = contract.deploy(deployer.address, { value: ton("1") });
    expect(res).toHaveSuccessfulDeploy({ to: contract.address });

    return (contract, deployer, notDeployer);
}
