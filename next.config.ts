import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  trailingSlash: true,
  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  skipTrailingSlashRedirect: true,
  images: {
    // unoptimized: true,
    loader: "custom",
    loaderFile: "./src/loader.ts",
  },
  reactCompiler: true,
  // Optional: Change the output directory `out` -> `docs` for github pages
  distDir: "docs",

  // ...prior options...
  // resolve: {
  //   alias: {
  //     buffer: 'buffer/',
  //   },
  // },
  // define: {
  //   Buffer: ['buffer', 'Buffer'],
  // },
  // ...later options...
};

export default nextConfig;
