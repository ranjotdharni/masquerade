import { createContext } from "react"
import type { AuthContextValue } from "../../lib/types/context"

export const AuthContext = createContext<AuthContextValue>({
    accessToken: undefined,
    refreshTokens: async () => { return undefined }
})
