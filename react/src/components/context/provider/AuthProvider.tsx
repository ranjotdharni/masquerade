import { useEffect, useState } from "react"
import type { AuthContextValue } from "../../../lib/types/context"
import { AuthContext } from "../AuthContext"
import FullScreenLoader from "../../utility/FullScreenLoader"

export const AuthProvider: React.FunctionComponent<AuthContextValue & { children: React.ReactNode }> = ({
    children
}) => {
    const [accessToken, setAccessToken] = useState<string | undefined>()

    async function refreshTokens() {
        // refresh logic
        return ""
    }

    async function performAuthCheck() {
        // auth checking logic
    }

    useEffect(() => {
        performAuthCheck()
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
