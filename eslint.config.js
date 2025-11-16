// @ts-check
const babelParser = require("@babel/eslint-parser")
const tseslint = require("@typescript-eslint/eslint-plugin")
const tsParser = require("@typescript-eslint/parser")
const react = require("eslint-plugin-react")
const ftFlow = require("eslint-plugin-ft-flow")
const importPlugin = require("eslint-plugin-import")
const prettierConfig = require("eslint-config-prettier")
const js = require("@eslint/js")
const globals = require("globals")

module.exports = [
  // Global ignores
  {
    ignores: [
      "**/node_modules/**",
      "**/build*/**",
      "**/dist/**",
      "**/coverage/**",
      "**/.cache/**",
      "**/*.min.js",
      "**/parse-hanson-string.js", // Generated parser file
      "**/parse-hanson-string.ts", // Generated parser file
      "**/flow-typed/**",
    ],
  },

  // Base configuration for all JS files (legacy support)
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: [
            "@babel/preset-react",
            "@babel/preset-flow",
            "@babel/preset-env",
          ],
        },
      },
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,

        // Webpack DefinePlugin
        VERSION: "readonly",
        APP_BASE: "readonly",

        // Test globals
        TESTING: "readonly",
      },
    },
    plugins: {
      react,
      "ft-flow": ftFlow,
      import: importPlugin,
    },
    settings: {
      react: {
        version: "16.5",
        flowVersion: "0.81",
      },
    },
  },

  // TypeScript configuration
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.browser,
        ...globals.node,

        // Webpack DefinePlugin
        VERSION: "readonly",
        APP_BASE: "readonly",

        // Test globals
        TESTING: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react,
      import: importPlugin,
    },
    settings: {
      react: {
        version: "16.5",
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      // Allow any types for now during migration
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },

  // ESLint recommended rules
  js.configs.recommended,

  // React recommended rules (flat config)
  react.configs.flat.recommended,

  // Flow type rules (manual config since no flat config available) - for legacy JS files
  {
    files: ["**/*.js", "**/*.jsx"],
    rules: {
      ...ftFlow.configs.recommended.rules,
      "ft-flow/no-types-missing-file-annotation": "off",
    },
  },

  // Custom project rules for all files
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    rules: {
      // Best practices
      "array-callback-return": "warn",
      camelcase: "error",
      "consistent-this": ["warn", "self"],
      curly: ["error", "multi-line"],
      "default-case": "error",
      eqeqeq: ["error", "smart"],
      "guard-for-in": "error",
      "new-cap": "off",
      "no-await-in-loop": "warn",
      "no-case-declarations": "error",
      "no-class-assign": "error",
      "no-console": "off",
      "no-const-assign": "error",
      "no-div-regex": "error",
      "no-extra-label": "error",
      "no-fallthrough": "error",
      "no-implicit-coercion": [
        "error",
        { boolean: true, number: true, string: true },
      ],
      "no-implicit-globals": "error",
      "no-new-symbol": "error",
      "no-redeclare": ["error", { builtinGlobals: true }],
      "no-restricted-syntax": ["error", "WithStatement"],
      "no-self-assign": "warn",
      "no-undef-init": "off",
      "no-underscore-dangle": "off",
      "no-unmodified-loop-condition": "error",
      "no-unused-labels": "error",
      "no-unused-vars": "off", // Disabled in favor of TypeScript's unused variable checking
      "no-useless-constructor": "error",
      "no-var": "error",
      "prefer-spread": "warn",

      // React rules
      "react/display-name": "off",
      "react/no-did-mount-set-state": "warn",
      "react/no-did-update-set-state": "warn",
      "react/no-multi-comp": "off",
      "react/self-closing-comp": "warn",
      "react/sort-prop-types": "warn",
      "react/wrap-multilines": "off",
      "react/no-unescaped-entities": "off",
    },
  },

  // TypeScript-specific rules
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // CLI-specific configuration
  {
    files: [
      "modules/gob-cli/**/*.{js,ts}",
      "modules/gob-hanson-format-cli/**/*.{js,ts}",
      "modules/gob-search-queries-cli/**/*.{js,ts}",
    ],
    rules: {
      "no-process-exit": "off",
      "no-implicit-globals": "off",
    },
  },

  // Web Worker-specific configuration
  {
    files: ["**/*.worker.{js,ts}", "**/workers/**/*.{js,ts}"],
    rules: {
      "consistent-this": "off",
    },
  },

  // Test-specific configuration
  {
    files: [
      "**/__tests__/**/*.{js,ts,tsx}",
      "**/*.test.{js,ts,tsx}",
      "**/*.spec.{js,ts,tsx}",
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      "no-empty": "off",
      "no-unused-expressions": "off",
      quotes: "off",
    },
  },

  // Prettier config must be last to override other rules
  prettierConfig,
]
