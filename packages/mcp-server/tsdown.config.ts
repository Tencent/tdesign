import { defineConfig, type Options } from "tsdown";

const shared: Options = {
  outDir: "dist",
  platform: "node",
  target: "es2020",
  minify: true,
  dts: false,
  sourcemap: false,
  clean: false,
  define: {
    "process.env.NODE_ENV": '"production"'
  }
};

const configs: Options[] = [
  {
    ...shared,
    entry: { stdio: "src/stdio.ts" },
    format: "esm",
    outExtensions: () => ({ js: ".js" }),
    banner: "#!/usr/bin/env node"
  },
  {
    ...shared,
    entry: { http: "src/http.ts" },
    format: "cjs", // for tencent cloud node v18 compatibility
    outExtensions: () => ({ js: ".cjs" })
  }
];

const targetInput = process.env.BUILD_TARGET;

export default defineConfig(
  targetInput ? configs.filter((config) => Object.keys(config.entry).includes(targetInput)) : configs
);
