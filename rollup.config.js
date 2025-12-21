import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/HoverZoom.ts",
  output: [
    {
      file: "dist/hoverzoom.esm.js",
      format: "esm",
    },
    {
      file: "dist/hoverzoom.umd.js",
      format: "umd",
      name: "HoverZoom",
      exports: "default",
    },
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: false,
      declarationMap: false,
    }),
    resolve(),
    commonjs(),
  ],
};
