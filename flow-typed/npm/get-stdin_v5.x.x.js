// flow-typed signature: 1a52ea1276f27756fa7db5e3eebdc107
// flow-typed version: 94e9f7e0a4/get-stdin_v5.x.x/flow_>=v0.28.x

declare module 'get-stdin' {
  declare module.exports: {
    (): Promise<string>,
    buffer(): Promise<Buffer>,
  };
}
