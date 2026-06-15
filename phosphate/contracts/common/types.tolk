enum Errors {
    NotOwner = 100
    InvalidMessage = 0xFFFF

    NotValidWallet = 74
    WrongWorkchain = 333
    BalanceError = 47
    NotEnoughGas = 48

    IncorrectSender = 700
    AccountTerminated = 701
    AccountInactive = 702
    InsufficientGasSent = 703
    ReservedInternal = 704
    // st UPGRADE_WALLET  = 705
    NoPendingRequest = 706
    CantUnfollowReported = 707
    IncorrectReceiver = 708
    InsufficientBalance = 709
    AlreadyReported = 710
    AccountNotReported = 711
    // st NOT_AUTHORIZED  = 712
    // st AMOUNT_EXCEEDS_MBRP  = 715
    NotFollowing = 717
    //ower Cleared by confirmRequestInternal bounce? TODO
    ConnectionExists = 719
    NotFriend = 720
    NotInvitor = 721
    AlreadyInvited = 723
    UnauthorizedBurn = 724
    MintClosed = 730
    NoVotesAvailable = 731
    NotVotedYet = 732
    Upgrade = 733
    WaitMore = 735
    NotCloseFriend = 736
    AlreadyVouched = 737
    ProvideCoordinates = 738
    InvalidFwdPayload = 739
    InviteFirst = 740
    AlreadyReportedForOtherReason = 741
    MaxConnections = 250 // coz accClosing contract can send only approx 250 msg once
}

// CONTRACT_CONSTS
// Declare a compile-time constant upper-bound for our map
const AUTHORITY_THRESHOLD = 1000000 // 1 million votes = 100,000 acounts/voters
const ZERO_ADDRESS = address("EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c") // TODO mainnet addr
const MBRP_AMOUNT: int = ton("1000") // NOTE: store as consts to upgrade with code now minter updates, any const update also updates version but should not
const LOTTERY_ENTRY_AMT: coins = ton("10")
const ACTIVATION_WAIT: int = 604800 // 1 WEEK
const INVITE_WAIT: int = 14400 // 4 HOURS
const MAX_CLAIM_PERIOD: int = 63072000 // 2 YEARS
const CLOSURE_WAIT: int = 86400 // 1 day
