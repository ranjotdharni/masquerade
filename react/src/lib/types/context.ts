
export type NotificationProps = {
    message: string,
    color?: string,
}

export type ConfirmProps = {
    message: string,
    callback: () => void | Promise<void>,
}

export type UIContextValue = {
    notify: (config: NotificationProps) => void,
    confirm: (config: ConfirmProps) => void,
}
