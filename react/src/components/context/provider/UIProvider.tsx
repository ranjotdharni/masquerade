import { useState } from "react"
import useNotify from "../../../lib/hooks/useNotify"
import type { ConfirmProps, NotificationProps, UIContextValue } from "../../../lib/types/context"
import { UIContext } from "../UIContext"

function Notification({ message, color, reset } : NotificationProps & { reset: () => void }) {

    return (
        <span style={{color: color}}>
            <p>{message}</p>
        </span>
    )
}

function Confirm({ message, callback, reset } : ConfirmProps & { reset: () => void }) {

    return (
        <aside>
            <h3>Are You Sure?</h3>
            <span>
                <p>{message}</p>
            </span>
            <div>
                <button>Cancel</button>
                <button>Confirm</button>
            </div>
        </aside>
    )
}

export const UIProvider: React.FunctionComponent<UIContextValue & { children: React.ReactNode }> = ({
    children
}) => {

    const [notification, setNotification] = useNotify()
    const [notificationColor, setNotificationColor] = useState<string | undefined>()
    const [confirmation, setConfirmation] = useState<ConfirmProps | undefined>()

    function notify(config: NotificationProps ) {
        setNotification(config.message)
        setNotificationColor(config.color)
    }

    function resetNotification() {

    }

    function confirm(config: ConfirmProps) {
        setConfirmation(config)
    }

    function resetConfirmation() {

    }

    return (
        <UIContext.Provider
            value={{
                notify: notify,
                confirm: confirm,
            }}
        >
            <>
                { children }
                { notification.trim() !== "" && <Notification message={notification} color={notificationColor} reset={resetNotification} /> }
                { confirmation && <Confirm message={confirmation.message} callback={confirmation.callback} reset={resetConfirmation} /> }
            </>
        </UIContext.Provider>
    )
}
