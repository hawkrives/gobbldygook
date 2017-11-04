// flow-typed signature: 95596051d0a57cf80949ae52d6e517c5
// flow-typed version: b43dff3e0e/get-stdin_v5.x.x/flow_>=v0.25.x

declare module 'get-stdin' {
  declare module.exports: {
    (): Promise<string>,
    buffer(): Promise<Buffer>,
  };
}
