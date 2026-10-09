// react-loadable@5 ships no types, and @types/react-loadable pulls in
// webpack 4's types. This covers the single-loader form gob-web uses.
declare module "react-loadable" {
  import type { ComponentType } from "react"

  export type LoadingComponentProps = {
    error?: unknown
    retry: () => unknown
    timedOut: boolean
    pastDelay: boolean
  }

  type Options<Props> = {
    // react-loadable unwraps a module only when it has webpack's __esModule
    // marker, which a native import() namespace lacks, so loaders return the
    // component itself
    loader: () => Promise<ComponentType<Props>>
    loading: ComponentType<LoadingComponentProps>
    delay?: number
    timeout?: number
  }

  export type LoadableComponent<Props> = ComponentType<Props> & {
    preload(): Promise<unknown>
  }

  export default function Loadable<Props>(
    options: Options<Props>,
  ): LoadableComponent<Props>
}
