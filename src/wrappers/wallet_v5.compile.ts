import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    // lang: 'func',
    // targets: ['wallet_v5.fc']
    lang: 'tolk',
    entrypoint: 'contracts/wallet-v5/v5.tolk',
    withSrcLineComments: true,
    withStackComments: true,
};
