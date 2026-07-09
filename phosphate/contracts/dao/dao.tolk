struct Proposal {
    id: uint64
    description: string
    votesFor: uint64
    votesAgainst: uint64
    executed: bool
}

struct Vote {
    proposalId: uint64
    support: bool
}

type DaoMsg =
    | Proposal
    | Vote

fun onBouncedMessage(_in: InMessageBounced) {}

fun onInternalMessage(_in: InMessage) {}

get fun get_dao_data() {}
