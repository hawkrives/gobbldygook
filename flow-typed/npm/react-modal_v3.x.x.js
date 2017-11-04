// flow-typed signature: 26836412583df6cdda81c18c2b955cc2
// flow-typed version: <<STUB>>/react-modal_v^3.0.0/flow_>=v0.58.0

declare module 'react-modal' {
  declare type Props = {
    isOpen: boolean,
    style?: {
      content?: Object,
      overlay?: Object,
    },
    appElement?: HTMLElement,
    ariaHideApp: boolean,
    closeTimeoutMS: number,
    onAfterOpen?: () => mixed,
    onRequestClose?: (event: SyntheticEvent<>) => mixed,
    shouldCloseOnOverlayClick: boolean,
  }
  declare class Modal extends React$Component<Props> {
    static setAppElement(element: HTMLElement | string): void;
    static defaultProps: {
      isOpen: boolean,
      ariaHideApp: boolean,
      closeTimeoutMS: number,
      shouldCloseOnOverlayClick: boolean,
    };
  }
  declare var exports: typeof Modal;
}
