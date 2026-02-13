import { DEFAULT_ERROR_MESSAGE, HTTP_401_UNAUTHORIZED, PAGE_LOGIN, RESERVED_AUTH_STATUSES } from "../constants"
import type { AuthContextValue } from "../types/context";
import type { GenericError, RecursiveObject } from "../types/internal"

const DEFAULT_AUTH_FAILURE_MESSAGE: string = "Please sign in."

export function getCookie(name: string): string | null {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function clientSignOut() {
    localStorage.removeItem(import.meta.env.VITE_ACCESS_TOKEN_NAME)
    localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_NAME)
    window.location.href = `/${PAGE_LOGIN}`
}

export async function authenticatedRequest(auth: AuthContextValue, endpoint: string, method: "GET" | "POST" | "PUT" | "DELETE", body?: Record<string | number | symbol, RecursiveObject<string | number | boolean>>, refresh: boolean = true): Promise<Record<string | number | symbol, RecursiveObject<string | number | boolean>> | GenericError> {
    if (!auth.accessToken) {
        return {
            error: true,
            message: "No authentication details were found. Please sign in.",
        } as GenericError
    }

    let response:  Record<string | number, string | number | boolean>
    
    try {
        response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
            method: method,
            credentials: 'include',
            headers: {
                "Authorization": `Bearer ${auth.accessToken}`,
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : undefined
        }).then(async middle => { 

            const reservedAuthStatusIndex: number = RESERVED_AUTH_STATUSES.findIndex(item => item.status === middle.status)
            
            if (reservedAuthStatusIndex !== -1) {
                switch (middle.status) {
                    case HTTP_401_UNAUTHORIZED: // Attempt to refresh access token on Unauthorized response
                        if (refresh) {
                            const refreshToken = localStorage.getItem(import.meta.env.VITE_REFRESH_TOKEN_NAME)

                            if (!refreshToken) {    // no refresh token exists, this should never happen on any authenticated view
                                clientSignOut()
                                return {
                                    error: true,
                                    message: DEFAULT_AUTH_FAILURE_MESSAGE
                                } as GenericError
                            }

                            const refreshResponse = await auth.refreshTokens()  // refresh = false, only attempt to refresh access token once

                            if (!refreshResponse || (refreshResponse as GenericError).error) {
                                clientSignOut()
                                return (!refreshResponse ? { error: true, message: DEFAULT_AUTH_FAILURE_MESSAGE } : refreshResponse) as GenericError
                            }
                            else {
                                const refreshedAuthDetails: AuthContextValue = {
                                    accessToken: refreshResponse as string,
                                    refreshTokens: auth.refreshTokens
                                }
                                return await authenticatedRequest(refreshedAuthDetails, endpoint, method, body, false)   // Re-attempt original request (only once, refresh = false) if token refreshed successfully
                            }
                        }
                        else {  // token refresh failed once, log user out
                            clientSignOut()
                            return {
                                error: true,
                                message: DEFAULT_AUTH_FAILURE_MESSAGE
                            } as GenericError
                        }
                        break;
                    default:    // reserved responses other than the above handled cases always log user out
                        clientSignOut()
                        return {
                            error: true,
                            message: DEFAULT_AUTH_FAILURE_MESSAGE
                        } as GenericError
                        break;
                }
            }

            return middle.json()
        }).then(result => {
            return result as Record<string | number, string | number | boolean>
        })
    }
    catch (error) {
        return {
            error: true,
            message: ((error as Error).message ? (error as Error).message : DEFAULT_ERROR_MESSAGE)
        } as GenericError
    }

    return response
}
