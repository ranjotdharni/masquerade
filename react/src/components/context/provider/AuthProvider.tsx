import { useEffect, useState } from "react"
import type { AuthContextValue } from "../../../lib/types/context"
import { AuthContext } from "../AuthContext"
import FullScreenLoader from "../../utility/FullScreenLoader"
import { authenticatedRequest, clientSignOut } from "../../../lib/utility/internal"
import { API_CONFIRM_AUTH, API_REFRESH_TOKENS } from "../../../lib/constants"
import type { GenericError } from "../../../lib/types/internal"

export const AuthProvider: React.FunctionComponent<AuthContextValue & { children: React.ReactNode }> = ({
    children
}) => {
    const [accessToken, setAccessToken] = useState<string | undefined>()

    async function refreshTokens() {
        // token refresh logic
        const existingRefreshToken: string | null = localStorage.getItem(import.meta.env.VITE_REFRESH_TOKEN_NAME)

        if (!existingRefreshToken) {
            clientSignOut()
            return {
                error: true,
                message: "No authentication details were found. Please sign in."
            } as GenericError
        }

        const response = await authenticatedRequest({ accessToken: existingRefreshToken, refreshTokens: async () => undefined }, API_REFRESH_TOKENS, "PUT", undefined, false)

        if ((response as GenericError).error)
            return response as GenericError

        const refreshedAccessToken: string = (response as Record<string | number, string | number | boolean>)[import.meta.env.VITE_ACCESS_TOKEN_NAME] as string
        localStorage.setItem(import.meta.env.VITE_REFRESH_TOKEN_NAME, (response as Record<string | number, string | number | boolean>)[import.meta.env.VITE_REFRESH_TOKEN_NAME] as string)

        setAccessToken(refreshedAccessToken)
        return refreshedAccessToken
    }

    async function confirmAuthWithServer(): Promise<boolean> {
        const authResult = await authenticatedRequest({accessToken: accessToken, refreshTokens: refreshTokens}, API_CONFIRM_AUTH, "POST")

        if (authResult.error)
            return false
        else if ((authResult as Record<string | number, string | number | boolean>)["success"])
            return true

        return false
    }

    async function performAuthCheck() {
        // auth checking logic
        const existingAccessToken: string | null = localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_NAME)
        const existingRefreshToken: string | null = localStorage.getItem(import.meta.env.VITE_REFRESH_TOKEN_NAME)

        if (existingAccessToken && existingRefreshToken) {
            setAccessToken(existingAccessToken)
            localStorage.removeItem(import.meta.env.VITE_ACCESS_TOKEN_NAME)
            
            const authIsValid = await confirmAuthWithServer()

            if (!authIsValid)
                clientSignOut()
        }
        else if (existingRefreshToken) {
            // refresh access token
            const refreshResponse = await refreshTokens()

            if ((refreshResponse as GenericError).error) {
                clientSignOut()
            }
            else {
                const authIsValid = await confirmAuthWithServer()

                if (!authIsValid)
                    clientSignOut()
            }
        }
        else {
            clientSignOut()
        }
    }

    useEffect(() => {
        if (import.meta.env.VITE_CONFIRM_AUTH === "true")
            performAuthCheck()
        else
            setAccessToken("")
    }, [])

    return (
        <AuthContext.Provider
            value={{
                accessToken: accessToken,
                refreshTokens: refreshTokens,
            }}
        >
            <>
                {
                    accessToken === undefined ? 
                    <FullScreenLoader loaderText="Authenticating..." /> :
                    children
                }
            </>
        </AuthContext.Provider>
    )
}
