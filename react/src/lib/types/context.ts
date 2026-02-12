import type { GenericError } from "./internal"

export type NotificationProps = {
    message: string,
    color?: string,
}

export type ConfirmProps = {
    message: string,
    callback: () => void | Promise<void>,
    loaderText?: string
}

export type UIContextValue = {
    notify: (config: NotificationProps) => void,
    confirm: (config: ConfirmProps) => void,
}

export type AuthContextValue = {
    accessToken: string | undefined
    refreshTokens: () => Promise<string | undefined | GenericError>
}
