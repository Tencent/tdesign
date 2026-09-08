import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

const plugins = [
  replace({
    preventAssignment: true,
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
  }),
  resolve({
    extensions: [".ts", ".js", ".json"]
  }),
  commonjs(),
  json(),
  typescript({
    include: ["src/**/*.ts", "../common/**/*.ts"],
    compilerOptions: {
      target: "ES2020",
      removeComments: true,
      importHelpers: false,
      allowSyntheticDefaultImports: true
    }
  }),
  terser()
];

const configs = [
  {
    input: "./src/stdio.ts",
    output: [
      {
        dir: "dist",
        format: "esm",
        entryFileNames: "stdio.js",
        banner: "#!/usr/bin/env node",
        sourcemap: false,
        inlineDynamicImports: true
      }
    ],
    plugins
  },
  {
    input: "./src/http.ts",
    output: [
      {
        dir: "dist",
        format: "cjs", // for tencent cloud node v18 compatibility
        entryFileNames: "http.cjs",
        sourcemap: false,
        inlineDynamicImports: true
      }
    ],
    plugins
  }
];

const targetInput = process.env.BUILD_TARGET;

export default targetInput ? configs.filter((config) => config.input.includes(targetInput)) : configs;
