// flow-typed signature: d1a1105eeb2861d864f8362b22b6ec7e
// flow-typed version: 872f3c99bd/pretty-ms_v3.x.x/flow_>=v0.25.x

type Options = {
  secDecimalDigits?: number,
  msDecimalDigits?: number,
  compact?: boolean,
  verbose?: boolean
};

declare module 'pretty-ms' {
  declare module.exports: (ms: number, opts?: Options) => string;
}
