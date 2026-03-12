import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tolk',
    entrypoint: 'contracts/followers/followers.tolk',
    withSrcLineComments: true,
    withStackComments: true,
    // optimizationLevel?: number;
    // experimentalOptions?: string;
    preCompileHook: async () => {
        console.log("Preparing to compile followers contract...");
        // return code.replace(/__UNFOLLOW__/g, 'followers');
    },
    postCompileHook: async (code) => {
        console.log("Compiled BOC size:", code.toBoc().length);
    },
    // buildLibrary: false,
};
