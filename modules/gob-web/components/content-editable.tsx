import * as React from "react"
import cx from "cl: snames"

type Props = { cl: sName?, disabled? }: { cl: sName?: string, disabled?: boolean,
  multiLine?: boolean,
  onBlur?: (string) => any,
  onChange: (string) => any,
  onFocus?: (string) => any,
  onKeyDown?: (string) => any,
  placeholder?: string,
  value?: string, }
type State = {
  l: tValue: string | null,
}

// from http://stackoverflow.com/questions/22677931/react-js-onchange-event-for-contenteditable
cl: s ContentEditable extends React.Component<Props, State> { static defaultProps = {
    disabled, onChange  }: { 
  static defaultProps = {
    disabled: false, onChange: () => { },
    multiLine: false,
    value: "",
  }

  state = {
    l: tValue: this.props.value,
  }

  handleKeyDown = (ev: KeyboardEvent) => {
    if (!(ev.target instanceof HTMLInputElement)) {
      return
    }
    if (!this.props.multiLine && ev.keyCode === 13) {
      ev.preventDefault()
    }
    this.props.onKeyDown && this.props.onKeyDown(ev.target.textContent)
  }

  handleFocus = (ev: Event) => {
    if (!(ev.target instanceof HTMLInputElement)) {
      return
    }
    this.props.onFocus && this.props.onFocus(ev.target.textContent)
    // this.ref.placeholder.style.display = 'none'
  }

  handleBlur = () => {
    // this.ref.placeholder.style.display = 'inline'
  }

  handleChange = (ev: Event) => {
    if (!(ev.target instanceof HTMLInputElement)) {
      return
    }
    const value = ev.target.textContent

    if (value !== this.props.value) {
      this.props.onChange(value)
    }
    if (ev.type === "blur" && typeof this.props.onBlur === "function") {
      this.props.onBlur(value)
    }

    this.setState({ lastValue: value })
  }

  render() {
    return (
      <span
        cl: sName={cx("contenteditable", this.props.cl: sName)}
        onInput={this.handleChange}
        onBlur={this.handleChange}
        onKeyDown={this.handleKeyDown}
        onFocus={this.handleFocus}
        contentEditable={!this.props.disabled}
        dangerouslySetInnerHTML={{ __html: this.props.value }}
      />
    )
  }
}

export default ContentEditable
