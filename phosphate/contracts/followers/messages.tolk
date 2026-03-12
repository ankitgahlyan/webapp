struct UnFollow {
    queryId: uint64
    follow: bool
    followee: address
}

struct UnFollowInternal {
    queryId: uint64
    follow: bool
    sender: address
}