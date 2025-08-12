module.exports = {
  presets: [
    "@babel/preset-react",
    "@babel/preset-flow",
    [
      "@babel/preset-env",
      {
        modules: false,
        useBuiltIns: "usage",
        corejs: 3,
        targets: {
          esmodules: true,
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
    test: {
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
    },
  },
}
