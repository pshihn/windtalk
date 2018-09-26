import minify from 'rollup-plugin-babel-minify';

const input = 'index.js';

export default [
  {
    input,
    output: {
      file: `dist/windtalk.umd.js`,
      format: 'umd',
      name: 'windtalk'
    }
  },
  {
    input,
    output: {
      file: `dist/windtalk.umd.min.js`,
      format: 'umd',
      name: 'windtalk'
    },
    plugins: [minify({ comments: false })]
  },
  {
    input,
    output: {
      file: `dist/windtalk.js`,
      format: 'iife',
      name: 'windtalk'
    }
  },
  {
    input,
    output: {
      file: `dist/windtalk.min.js`,
      format: 'iife',
      name: 'windtalk'
    },
    plugins: [minify({ comments: false })]
  },
  {
    input,
    output: {
      file: `dist/windtalk.m.js`,
      format: 'esm'
    }
  },
  {
    input,
    output: {
      file: `dist/windtalk.m.min.js`,
      format: 'esm'
    },
    plugins: [minify({ comments: false })]
  },
];