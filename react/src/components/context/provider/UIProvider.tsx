import { useEffect, useState, type MouseEvent } from "react"
import type { ConfirmProps, NotificationProps, UIContextValue } from "../../../lib/types/context"
import { UIContext } from "../UIContext"
import useTimeout from "../../../lib/hooks/useTimeout"
import FullScreenLoader from "../../utility/FullScreenLoader"

const UI_NOTIFICATION_MILLISECONDS: number = 8000
const notificationInitialTranslation: string = "translateY(120%)"

function Notification({ message, color, reset } : NotificationProps & { reset: () => void }) {
    const [translateY, setTranslateY] = useState<string>(notificationInitialTranslation)
    const hideTextTimer = useTimeout(0)
    const clearTextTimer = useTimeout(0)

    useEffect(() => {
        if (message.trim() !== "" && !hideTextTimer.completed) {
            hideTextTimer.begin(UI_NOTIFICATION_MILLISECONDS)
            clearTextTimer.begin(UI_NOTIFICATION_MILLISECONDS + 1000)
            setTranslateY("translateY(0%)")
        }
        
        if (hideTextTimer.completed) {
            setTranslateY(notificationInitialTranslation)
        }

        if (clearTextTimer.completed) {
            reset()
            hideTextTimer.reset()
            clearTextTimer.reset()
        }
    }, [message, hideTextTimer.completed, clearTextTimer.completed])

    return (
        <aside style={{overflowY: message.trim() === "" ? "hidden" : "clip"}} className="z-30 absolute w-[90%] h-[10vh] left-[5%] top-[90vh]">
            <div style={{transform: translateY, opacity: translateY === notificationInitialTranslation ? 0 : 1, transition: "opacity 0.3s ease, transform 0.4s ease", display: message.trim() === "" ? "none" : "flex"}} className="flex-col justify-start items-center md:items-end">
                <span style={{color: color}} className="w-full h-auto max-h-1/2 py-4 md:w-auto md:px-8 font-jbm flex flex-row justify-center items-center border bg-background border-accent rounded-lg">
                    <p>{message}</p>
                </span>
            </div>
        </aside>
    )
}

function Confirm({ message, callback, loaderText, reset } : ConfirmProps & { reset: () => void }) {
    const [loader, setLoader] = useState<boolean>(false)

    async function onConfirm(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        setLoader(true)
        await callback()
        setLoader(false)
        reset()
    }

    function onCancel(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        reset()
    }

    return (
        <div className="z-40 absolute w-[100vw] h-[100vh] top-0 left-0 flex flex-col justify-center items-center popInBlur">
            {
                loader ?
                <FullScreenLoader loaderText={loaderText} /> :
                <aside className="relative w-[90%] h-[50%] md:w-1/5 md:aspect-video md:h-auto p-2 flex flex-col justify-start items-center rounded-lg border bg-background border-primary popIn">
                    <h3 className="w-full px-2 border-b border-primary text-xl text-error font-jbm-bold">Are You Sure?</h3>
                    <span className="w-full p-2 flex-1 text-text font-jbm text-sm">
                        <p>{message}</p>
                    </span>
                    <div className="w-full h-auto flex flex-row justify-end space-x-2">
                        <button onClick={onCancel} className="appButton bg-error! text-background!">Cancel</button>
                        <button onClick={onConfirm} className="appButton bg-primary! text-background!">Confirm</button>
                    </div>
                </aside>
            }
        </div>
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
                { confirmation && <Confirm message={confirmation.message} callback={confirmation.callback} loaderText={confirmation.loaderText} reset={resetConfirmation} /> }
            </>
        </UIContext.Provider>
    )
}
