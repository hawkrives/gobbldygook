// flow-typed signature: f523b1ef4ab2de4542946d8ff8f9d2be
// flow-typed version: a92e9b07d7/styled-components_v3.x.x/flow_>=v0.75.x

// @flow

declare module 'styled-components' {
  import type {Ref} from 'react'

  declare export type Interpolation = (<C: {}>(executionContext: C) => string) | string | number;
  declare export type NameGenerator = (hash: number) => string;

  declare export type TaggedTemplateLiteral<R> = {| (Array<string>, Interpolation): R |};

  // ---- FUNCTIONAL COMPONENT DEFINITIONS ----
  declare export type ReactComponentFunctional<Props, DefaultProps = *> =
    & { defaultProps: DefaultProps }
    & ReactComponentFunctionalUndefinedDefaultProps<Props>

  declare export type ReactComponentFunctionalUndefinedDefaultProps<Props> =
    React$StatelessFunctionalComponent<Props>

  // ---- CLASS COMPONENT DEFINITIONS ----
  declare class ReactComponent<Props, DefaultProps> extends React$Component<Props> {
    static defaultProps: DefaultProps
  }
  declare export type ReactComponentClass<Props, DefaultProps = *> = Class<ReactComponent<Props, DefaultProps>>
  declare export type ReactComponentClassUndefinedDefaultProps<Props> = Class<React$Component<Props, *>>

  // ---- COMPONENT FUNCTIONS INPUT (UNION) & OUTPUT (INTERSECTION) ----
  declare export type ReactComponentUnion<Props> =
    ReactComponentUnionWithDefaultProps<Props, *>

  declare type ReactComponentUnionWithDefaultProps<Props, DefaultProps> =
    | ReactComponentFunctional<Props, DefaultProps>
    | ReactComponentFunctionalUndefinedDefaultProps<Props>
    | ReactComponentClass<Props, DefaultProps>
    | ReactComponentClassUndefinedDefaultProps<Props>

  declare export type ReactComponentIntersection<Props, DefaultProps = *> =
    & ReactComponentFunctional<Props, DefaultProps>
    & ReactComponentClass<Props, DefaultProps>;

  // ---- WITHCOMPONENT ----
  declare type ReactComponentStyledWithComponent<ComponentList> = <
    Props, DefaultProps,
    Input:
      | ComponentList
      | ReactComponentStyled<Props, DefaultProps>
      | ReactComponentUnionWithDefaultProps<Props, DefaultProps>
  >(Input) => ReactComponentStyled<Props, DefaultProps>

  // ---- STATIC PROPERTIES ----
  declare export type ReactComponentStyledStaticProps<Props, ComponentList=ComponentListKeys> = {|
    attrs: <AdditionalProps: {}>(AdditionalProps) => ReactComponentStyledTaggedTemplateLiteral<Props & AdditionalProps, ComponentList>,
    extend: ReactComponentStyledTaggedTemplateLiteral<Props, ComponentList>,
  |}

  declare type ReactComponentStyledStaticPropsWithComponent<Props, ComponentList> = {|
    ref: Ref<*> | (Ref<*> => any),
    attrs: <AdditionalProps: {}>(AdditionalProps) => ReactComponentStyledTaggedTemplateLiteralWithComponent<Props & AdditionalProps, ComponentList>,
  |}

  // ---- STYLED FUNCTION ----
  // Error: styled(CustomComponent).withComponent('a')
  // Ok:    styled('div').withComponent('a')
  declare type Call<ComponentListKeys> =
    & (ComponentListKeys => ReactComponentStyledTaggedTemplateLiteralWithComponent<{}, ComponentListKeys>)
    & (<Props>(ReactComponentUnion<Props>) => ReactComponentStyledTaggedTemplateLiteral<Props, ComponentListKeys>)

  // ---- STYLED COMPONENT ----
  declare type ReactComponentStyled<Props, ComponentList=ComponentListKeys, DefaultProps = *> =
    & ReactComponentStyledStaticPropsWithComponent<Props, ComponentList>
    & ReactComponentIntersection<Props, DefaultProps>

  // ---- TAGGED TEMPLATE LITERAL ----
  declare type ReactComponentStyledTaggedTemplateLiteral<Props, ComponentList> =
    & ReactComponentStyledStaticProps<Props, ComponentList>
    & TaggedTemplateLiteral<ReactComponentStyled<Props, ComponentList>>

  declare export type ReactComponentStyledTaggedTemplateLiteralWithComponent<Props, ComponentList=ComponentListKeys> =
    & ReactComponentStyledStaticPropsWithComponent<Props, ComponentList>
    & TaggedTemplateLiteral<ReactComponentStyled<Props, ComponentList>>

  // ---- WITHTHEME ----
  declare type WithThemeReactComponentClass = <
    InputProps: { theme: Theme },
    InputDefaultProps: {},
    OutputProps: $Diff<InputProps, { theme: Theme }>,
    OutputDefaultProps: InputDefaultProps & { theme: Theme },
  >(ReactComponentClass<InputProps, InputDefaultProps>) => ReactComponentClass<OutputProps, OutputDefaultProps>

  declare type WithThemeReactComponentClassUndefinedDefaultProps = <
    InputProps: { theme: Theme },
    OutputProps: $Diff<InputProps, { theme: Theme }>,
  >(ReactComponentClassUndefinedDefaultProps<InputProps>) => ReactComponentClass<OutputProps, { theme: Theme }>

  declare type WithThemeReactComponentFunctional = <
    InputProps: { theme: Theme },
    InputDefaultProps: {},
    OutputProps: $Diff<InputProps, { theme: Theme }>,
    OutputDefaultProps: InputDefaultProps & { theme: Theme },
  >(ReactComponentFunctional<InputProps, InputDefaultProps>) => ReactComponentFunctional<OutputProps, OutputDefaultProps>

  declare type WithThemeReactComponentFunctionalUndefinedDefaultProps = <
    InputProps: { theme: Theme },
    OutputProps: $Diff<InputProps, { theme: Theme }>
  >(ReactComponentFunctionalUndefinedDefaultProps<InputProps>) => ReactComponentFunctional<OutputProps, { theme: Theme }>

  declare type WithTheme =
    & WithThemeReactComponentClass
    & WithThemeReactComponentClassUndefinedDefaultProps
    & WithThemeReactComponentFunctional
    & WithThemeReactComponentFunctionalUndefinedDefaultProps

  // ---- MISC ----
  declare export type Theme = $ReadOnly<{[key: string]: mixed}>;
  declare export type ThemeProviderProps = {
    theme: Theme | ((outerTheme: Theme) => void)
  };

  declare class ThemeProvider extends React$Component<ThemeProviderProps> {}

  declare class StyleSheetManager extends React$Component<{ sheet: mixed }> {}

  declare class ServerStyleSheet {
    instance: StyleSheet;
    collectStyles: (children: any) => React$Node;
    getStyleTags: () => string;
    getStyleElement: () => React$Node;
    interleaveWithNodeStream: (readableStream: stream$Readable) => stream$Readable;
  }

  declare export type ComponentListKeys =
    $Subtype<$Keys<StyledComponentsComponentList>>

  declare type StyledComponentsComponentListValue =
    ReactComponentStyledTaggedTemplateLiteralWithComponent<{}, ComponentListKeys>

  // ---- COMPONENT LIST ----
  declare type StyledComponentsComponentList = {|
    a:                        StyledComponentsComponentListValue,
    abbr:                     StyledComponentsComponentListValue,
    address:                  StyledComponentsComponentListValue,
    area:                     StyledComponentsComponentListValue,
    article:                  StyledComponentsComponentListValue,
    aside:                    StyledComponentsComponentListValue,
    audio:                    StyledComponentsComponentListValue,
    b:                        StyledComponentsComponentListValue,
    base:                     StyledComponentsComponentListValue,
    bdi:                      StyledComponentsComponentListValue,
    bdo:                      StyledComponentsComponentListValue,
    big:                      StyledComponentsComponentListValue,
    blockquote:               StyledComponentsComponentListValue,
    body:                     StyledComponentsComponentListValue,
    br:                       StyledComponentsComponentListValue,
    button:                   StyledComponentsComponentListValue,
    canvas:                   StyledComponentsComponentListValue,
    caption:                  StyledComponentsComponentListValue,
    cite:                     StyledComponentsComponentListValue,
    code:                     StyledComponentsComponentListValue,
    col:                      StyledComponentsComponentListValue,
    colgroup:                 StyledComponentsComponentListValue,
    data:                     StyledComponentsComponentListValue,
    datalist:                 StyledComponentsComponentListValue,
    dd:                       StyledComponentsComponentListValue,
    del:                      StyledComponentsComponentListValue,
    details:                  StyledComponentsComponentListValue,
    dfn:                      StyledComponentsComponentListValue,
    dialog:                   StyledComponentsComponentListValue,
    div:                      StyledComponentsComponentListValue,
    dl:                       StyledComponentsComponentListValue,
    dt:                       StyledComponentsComponentListValue,
    em:                       StyledComponentsComponentListValue,
    embed:                    StyledComponentsComponentListValue,
    fieldset:                 StyledComponentsComponentListValue,
    figcaption:               StyledComponentsComponentListValue,
    figure:                   StyledComponentsComponentListValue,
    footer:                   StyledComponentsComponentListValue,
    form:                     StyledComponentsComponentListValue,
    h1:                       StyledComponentsComponentListValue,
    h2:                       StyledComponentsComponentListValue,
    h3:                       StyledComponentsComponentListValue,
    h4:                       StyledComponentsComponentListValue,
    h5:                       StyledComponentsComponentListValue,
    h6:                       StyledComponentsComponentListValue,
    head:                     StyledComponentsComponentListValue,
    header:                   StyledComponentsComponentListValue,
    hgroup:                   StyledComponentsComponentListValue,
    hr:                       StyledComponentsComponentListValue,
    html:                     StyledComponentsComponentListValue,
    i:                        StyledComponentsComponentListValue,
    iframe:                   StyledComponentsComponentListValue,
    img:                      StyledComponentsComponentListValue,
    input:                    StyledComponentsComponentListValue,
    ins:                      StyledComponentsComponentListValue,
    kbd:                      StyledComponentsComponentListValue,
    keygen:                   StyledComponentsComponentListValue,
    label:                    StyledComponentsComponentListValue,
    legend:                   StyledComponentsComponentListValue,
    li:                       StyledComponentsComponentListValue,
    link:                     StyledComponentsComponentListValue,
    main:                     StyledComponentsComponentListValue,
    map:                      StyledComponentsComponentListValue,
    mark:                     StyledComponentsComponentListValue,
    menu:                     StyledComponentsComponentListValue,
    menuitem:                 StyledComponentsComponentListValue,
    meta:                     StyledComponentsComponentListValue,
    meter:                    StyledComponentsComponentListValue,
    nav:                      StyledComponentsComponentListValue,
    noscript:                 StyledComponentsComponentListValue,
    object:                   StyledComponentsComponentListValue,
    ol:                       StyledComponentsComponentListValue,
    optgroup:                 StyledComponentsComponentListValue,
    option:                   StyledComponentsComponentListValue,
    output:                   StyledComponentsComponentListValue,
    p:                        StyledComponentsComponentListValue,
    param:                    StyledComponentsComponentListValue,
    picture:                  StyledComponentsComponentListValue,
    pre:                      StyledComponentsComponentListValue,
    progress:                 StyledComponentsComponentListValue,
    q:                        StyledComponentsComponentListValue,
    rp:                       StyledComponentsComponentListValue,
    rt:                       StyledComponentsComponentListValue,
    ruby:                     StyledComponentsComponentListValue,
    s:                        StyledComponentsComponentListValue,
    samp:                     StyledComponentsComponentListValue,
    script:                   StyledComponentsComponentListValue,
    section:                  StyledComponentsComponentListValue,
    select:                   StyledComponentsComponentListValue,
    small:                    StyledComponentsComponentListValue,
    source:                   StyledComponentsComponentListValue,
    span:                     StyledComponentsComponentListValue,
    strong:                   StyledComponentsComponentListValue,
    style:                    StyledComponentsComponentListValue,
    sub:                      StyledComponentsComponentListValue,
    summary:                  StyledComponentsComponentListValue,
    sup:                      StyledComponentsComponentListValue,
    table:                    StyledComponentsComponentListValue,
    tbody:                    StyledComponentsComponentListValue,
    td:                       StyledComponentsComponentListValue,
    textarea:                 StyledComponentsComponentListValue,
    tfoot:                    StyledComponentsComponentListValue,
    th:                       StyledComponentsComponentListValue,
    thead:                    StyledComponentsComponentListValue,
    time:                     StyledComponentsComponentListValue,
    title:                    StyledComponentsComponentListValue,
    tr:                       StyledComponentsComponentListValue,
    track:                    StyledComponentsComponentListValue,
    u:                        StyledComponentsComponentListValue,
    ul:                       StyledComponentsComponentListValue,
    var:                      StyledComponentsComponentListValue,
    video:                    StyledComponentsComponentListValue,
    wbr:                      StyledComponentsComponentListValue,

    // SVG
    circle:                   StyledComponentsComponentListValue,
    clipPath:                 StyledComponentsComponentListValue,
    defs:                     StyledComponentsComponentListValue,
    ellipse:                  StyledComponentsComponentListValue,
    g:                        StyledComponentsComponentListValue,
    image:                    StyledComponentsComponentListValue,
    line:                     StyledComponentsComponentListValue,
    linearGradient:           StyledComponentsComponentListValue,
    mask:                     StyledComponentsComponentListValue,
    path:                     StyledComponentsComponentListValue,
    pattern:                  StyledComponentsComponentListValue,
    polygon:                  StyledComponentsComponentListValue,
    polyline:                 StyledComponentsComponentListValue,
    radialGradient:           StyledComponentsComponentListValue,
    rect:                     StyledComponentsComponentListValue,
    stop:                     StyledComponentsComponentListValue,
    svg:                      StyledComponentsComponentListValue,
    text:                     StyledComponentsComponentListValue,
    tspan:                    StyledComponentsComponentListValue,
  |}

  declare export var css: TaggedTemplateLiteral<Array<Interpolation>>;
  declare export var createGlobalStyle: any;
  declare export var keyframes: TaggedTemplateLiteral<string>;
  declare export var withTheme: WithTheme;
  declare export var ServerStyleSheet: typeof ServerStyleSheet;
  declare export var StyleSheetManager: typeof StyleSheetManager;
  declare export var ThemeProvider: typeof ThemeProvider;

  declare export default {
    css: TaggedTemplateLiteral<Array<Interpolation>>,
    ...StyledComponentsComponentList,
  } & {
    [[call]]: Call<ComponentListKeys>
  }
}
