struct (0x00000015) UnFollow {
    queryId: uint64
    follow: bool
    followee: address
}

struct (0x00000016)UnFollowInternal {
    queryId: uint64
    follow: bool
    sender: address
}