import styled from "styled-components"
import map from "lodash/map.js"
import { connect } from "react-redux"
import type { ConnectedProps } from "react-redux"
import { removeNotification } from "./redux/actions.ts"
import type { RootState } from "../../redux/reducer.ts"
import Notification from "./notification.tsx"

const NotificationList = styled.ul`
  position: fixed;
  bottom: 15px;
  left: 15px;

  padding: 0;
  margin: 0;
  list-style: none;
  z-index: 10;
`

const connector = connect(
  (state: RootState) => ({ notifications: state.notifications }),
  { removeNotification },
)

type Props = Readonly<ConnectedProps<typeof connector>>

export const Notifications = ({ notifications, removeNotification }: Props) => (
  <NotificationList>
    {map(notifications, (n, i) => (
      <Notification
        notification={n}
        key={i}
        onClose={() => removeNotification(i)}
      />
    ))}
  </NotificationList>
)

export default connector(Notifications)
