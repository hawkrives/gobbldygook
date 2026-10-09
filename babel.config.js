// Compiles for the current Node instead of browsers: used by Jest and by the
// command-line tools.
const nodeConfig = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { node: "current" },
        modules: "commonjs",
        useBuiltIns: "usage",
        corejs: 3,
      },
    ],
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        regenerator: false,
        useESModules: false,
      },
    ],
  ],
}

module.exports = {
  presets: [
    // The automatic runtime matches tsconfig's "jsx": "react-jsx", so .tsx
    // files don't need React in scope
    ["@babel/preset-react", { runtime: "automatic" }],
    [
      "@babel/preset-env",
      {
        modules: false,
        useBuiltIns: "usage",
        corejs: 3,
        targets: {
          esmodules: true,
          // The browsers list below is preserved for reference in case we need to target specific browsers in the future.
          // browsers: [
          //   "last 2 versions",
          //   "not dead",
          //   "not < 2%",
          //   "not ie 11"
          // ]
        },
        bugfixes: true,
        shippedProposals: true,
      },
    ],
  ],
  // The remaining .js files (configs, CLI entry points, the generated
  // Hanson parser) are plain JavaScript; only .ts/.tsx need the TypeScript preset.
  overrides: [
    {
      test: /\.tsx?$/,
      presets: [["@babel/preset-typescript", { allowDeclareFields: true }]],
    },
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        regenerator: false,
        useESModules: true,
      },
    ],
    "babel-plugin-styled-components",
    // turns `import {sum} from 'lodash'`
    // into `import sum from 'lodash/sum'`
    // "babel-plugin-lodash",
  ],
  env: {
    test: nodeConfig,
    // The command-line tools in gob-cli load the source through @babel/register.
    node: nodeConfig,
  },
}
