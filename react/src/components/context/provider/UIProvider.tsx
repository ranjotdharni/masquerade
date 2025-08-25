import { useEffect, useState, type MouseEvent } from "react"
import type { ConfirmProps, NotificationProps, UIContextValue } from "../../../lib/types/context"
import { UIContext } from "../UIContext"
import useTimeout from "../../../lib/hooks/useTimeout"

const UI_NOTIFICATION_MILLISECONDS: number = 8000

function Notification({ message, color, reset } : NotificationProps & { reset: () => void }) {
    let hiddenTopValue: string = "103vh"
    let visibleTopValue: string = "90vh"

    const [top, setTop] = useState<string>(hiddenTopValue)
    const hideTextTimer = useTimeout(0)
    const clearTextTimer = useTimeout(0)

    useEffect(() => {
        if (message.trim() !== "" && !hideTextTimer.completed) {
            hideTextTimer.begin(UI_NOTIFICATION_MILLISECONDS)
            clearTextTimer.begin(UI_NOTIFICATION_MILLISECONDS + 1000)
            setTop(visibleTopValue)
        }
        
        if (hideTextTimer.completed) {
            setTop(hiddenTopValue)
        }

        if (clearTextTimer.completed) {
            reset()
            hideTextTimer.reset()
            clearTextTimer.reset()
        }
    }, [message, hideTextTimer.completed, clearTextTimer.completed])

    return (
        <span style={{color: color, top: top, transition: "top 0.3s ease"}} className="absolute w-[90%] h-auto left-[5%] py-4 md:left-[2.5%] md:w-auto md:px-8 font-jbm flex flex-row justify-center items-center border bg-background border-accent rounded-lg">
            <p>{message}</p>
        </span>
    )
}

function Confirm({ message, callback, reset } : ConfirmProps & { reset: () => void }) {

    async function onConfirm(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        await callback()
        reset()
    }

    function onCancel(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        reset()
    }

    return (
        <aside>
            <h3>Are You Sure?</h3>
            <span>
                <p>{message}</p>
            </span>
            <div>
                <button onClick={onCancel}>Cancel</button>
                <button onClick={onConfirm}>Confirm</button>
            </div>
        </aside>
    )
}

export const UIProvider: React.FunctionComponent<UIContextValue & { children: React.ReactNode }> = ({
    children
}) => {
    const [notification, setNotification] = useState<NotificationProps>({ message: "" })
    const [confirmation, setConfirmation] = useState<ConfirmProps | undefined>()

    function notify(config: NotificationProps ) {
        setNotification(config)
    }

    function resetNotification() {
        setNotification({ message: "" })
    }

    function confirm(config: ConfirmProps) {
        setConfirmation(config)
    }

    function resetConfirmation() {
        setConfirmation(undefined)
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
                <Notification message={notification.message} color={notification.color} reset={resetNotification} />
                { confirmation && <Confirm message={confirmation.message} callback={confirmation.callback} reset={resetConfirmation} /> }
            </>
        </UIContext.Provider>
    )
}
