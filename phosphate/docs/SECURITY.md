# FossFiWallet Security Improvements

## Overview

This document outlines security improvements for the FossFiWallet contract based on TON security best practices.

## Security Issues Found

### 1. Integer Overflow/Underflow (CRITICAL)

**Issue**: Arithmetic operations without bounds validation can lead to overflow/underflow.

**Current Code** (fossFiWallet.tolk:103):

```
store.jettonBalance += msg.jettonAmount;
```

**Fix**: Add bounds checking:

```tolk
// Before adding, validate the amount is within reasonable bounds
throw_unless(ERR_INVALID_AMOUNT, msg.jettonAmount > 0);
throw_unless(ERR_BALANCE_OVERFLOW, msg.jettonAmount < MAX_JETTON_SUPPLY);
store.jettonBalance += msg.jettonAmount;
```

**Issue**: Voting power transfer (if exists elsewhere):

```
from_votes -= amount;  // Can become negative!
```

**Fix**:

```
throw_unless(ERR_INSUFFICIENT_VOTES, from_votes >= amount);
from_votes -= amount;
```

### 2. Insecure Bounce Handling (HIGH)

**Issue**: Bounce handler restores balances without verifying sender authenticity.

**Current Code** (fossFiWallet.tolk:47-77):

```
fun onBouncedMessage(in: InMessageBounced): void {
    // todo: do we need to check correct sender here?  <-- SECURITY ISSUE
    ...
    store.jettonBalance += restoreAmount;
}
```

**Fix**: Add sender validation:

```tolk
fun onBouncedMessage(in: InMessageBounced): void {
    // CRITICAL: Validate bounce is from trusted source
    val store = lazy FiWalletStore.load();
    val addrs = lazy store.addresses.load();

    // Only accept bounces from trusted contracts
    throw_unless(ERR_UNTRUSTED_BOUNCE,
        in.senderAddress == addrs.minterAddr |
        in.senderAddress == addrs.treasury |
        isTrustedForwarder(in.senderAddress)
    );

    // Rest of bounce handling...
}
```

### 3. Reentrancy Protection (MEDIUM)

**Issue**: No protection against reentrancy attacks in transfer paths.

**Fix**: Implement a reentrancy guard:

```tolk
struct FiWalletStore {
    // ... existing fields ...
    reentrancyLock: int;  // 0 = unlocked, 1 = locked
}

fun requireNoReentrancy(): void {
    throw_unless(ERR_REENTRANCY, store.reentrancyLock == 0);
    store.reentrancyLock = 1;
}

fun releaseReentrancy(): void {
    store.reentrancyLock = 0;
}

fun onInternalMessage(in: InMessage): void {
    requireNoReentrancy();
    // ... process message ...
    // Release after all state modifications, before external calls
    releaseReentrancy();
}
```

### 4. Access Control Improvements (MEDIUM)

**Issue**: Some operations only check owner, not additional authorization levels.

**Current Code** (fossFiWallet.tolk:161):

```
assert (in.senderAddress == addrs.owner) throw ERROR_NOT_OWNER;
```

**Fix**: Add role-based access control:

```tolk
fun isAuthorized(sender: address, requiredRole: int): bool {
    val store = lazy FiWalletStore.load();
    val addrs = lazy store.addresses.load();

    // Role 0 = Owner, Role 1 = Authority, Role 2 = Minter
    if (requiredRole == 0) {
        return sender == addrs.owner;
    }
    if (requiredRole == 1) {
        return sender == addrs.owner | sender == addrs.treasury;
    }
    if (requiredRole == 2) {
        return sender == addrs.minterAddr;
    }
    return false;
}
```

### 5. Version Upgrade Security (MEDIUM)

**Issue**: Version checks could allow downgrade attacks.

**Current Code** (fossFiWallet.tolk:93-98):

```
if (msg.version == store.version) {
    // continue
} else if (msg.version < store.version) {
    sendUpgrade(...);
} else {
    requestUpgrade(...);
}
```

**Fix**: Add version validation and require authorized upgraders:

```tolk
fun handleVersionUpgrade(sender: address, newVersion: int): void {
    val store = lazy FiWalletStore.load();

    // Reject same version (no-op)
    throw_unless(ERR_SAME_VERSION, newVersion != store.version);

    // Only allow upgrades from treasury/owner
    throw_unless(ERR_UNAUTHORIZED_UPGRADE,
        sender == store.treasury | sender == store.owner
    );

    // Reject downgrades
    throw_unless(ERR_DOWNGRADE, newVersion > store.version);

    // Proceed with upgrade...
}
```

### 6. Dynamic Gas Validation (LOW)

**Issue**: Hardcoded gas checks don't adapt to network conditions.

**Current Code** (fossFiWallet.tolk:167):

```
assert (in.valueCoins > ton("0.5")) throw ERROR_NOT_ENOUGH_GAS;
```

**Fix**: Use dynamic gas calculation:

```tolk
fun validateTransferGas(valueCoins: coins, forwardAmount: coins): void {
    val gasForwardFee = getForwardFeeEstimate(forwardAmount);
    val minRequired = MIN_ATTACHED_FOR_TRANSFER + gasForwardFee + computeGasFees();
    throw_unless(ERR_INSUFFICIENT_GAS, valueCoins >= minRequired);
}
```

### 7. Add Emergency Stop (CRITICAL)

**Issue**: No way to pause contract in case of detected attack.

**Fix**: Implement pausable design:

```tolk
struct FiWalletStore {
    // ... existing fields ...
    paused: bool;  // Emergency pause flag
}

fun requireNotPaused(): void {
    throw_unless(ERR_PAUSED, store.paused == false);
}

fun onInternalMessage(in: InMessage): void {
    requireNotPaused();
    // ... rest of handler ...
}
```

## New Error Codes to Add

```tolk
const ERR_INVALID_AMOUNT = 1001
const ERR_BALANCE_OVERFLOW = 1002
const ERR_UNTRUSTED_BOUNCE = 1003
const ERR_REENTRANCY = 1004
const ERR_UNAUTHORIZED_UPGRADE = 1005
const ERR_DOWNGRADE = 1006
const ERR_SAME_VERSION = 1007
const ERR_PAUSED = 1008
const ERR_INSUFFICIENT_VOTES = 1009
```

## Testing Recommendations

1. **Fuzz Testing**: Test with extreme values (0, MAX_INT, negative where applicable)
2. **Reentrancy Tests**: Try to call transfer recursively
3. **Bounce Tests**: Verify malicious bounces are rejected
4. **Gas Exhaustion Tests**: Ensure proper revert on insufficient gas
5. **Upgrade Tests**: Verify downgrade attacks fail
6. **Access Control Tests**: Test all roles for each privileged operation

## Summary Checklist

- [ ] Add bounds checking on all arithmetic operations
- [ ] Validate bounce message senders
- [ ] Implement reentrancy guard
- [ ] Add role-based access control
- [ ] Prevent version downgrades
- [ ] Use dynamic gas validation
- [ ] Implement emergency pause mechanism
- [ ] Add comprehensive error codes
- [ ] Write security-focused tests
- [ ] Consider formal verification for critical paths
