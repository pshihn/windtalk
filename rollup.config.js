import { terser } from "rollup-plugin-terser";

const input = 'index.js';

export default [
  {
    input,
    output: {
      file: `dist/windtalk.js`,
      format: 'iife',
      name: 'windtalk'
    },
    plugins: [terser()]
  },
  {
    input,
    output: {
      file: `dist/windtalk.umd.js`,
      format: 'umd',
      name: 'windtalk'
    },
    plugins: [terser()]
  },
  {
    input,
    output: {
      file: `dist/windtalk.m.js`,
      format: 'esm'
    },
    plugins: [terser()]
  },
];