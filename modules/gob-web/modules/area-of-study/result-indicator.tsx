import { Icon } from "../../components/icon"
import { checkmark, close } from "../../icons/ionicons"

export default function ResultIndicator({
  result,
}: Readonly<{
  result?: boolean | undefined
}>) {
  // results come from evaluated area data, so check truthiness
  let succeeded = Boolean(result)
  return (
    <Icon
      className={`result-indicator ${
        succeeded ? "result-indicator--success" : "result-indicator--failure"
      }`}
    >
      {succeeded ? checkmark : close}
    </Icon>
  )
}
