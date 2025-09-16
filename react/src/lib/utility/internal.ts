import { API_REFRESH_TOKENS, HTTP_401_UNAUTHORIZED, PAGE_LOGIN, RESERVED_AUTH_STATUSES } from "../constants"
import type { GenericError, RecursiveObject } from "../types/internal"

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
    window.location.href = `/${PAGE_LOGIN}`
}

export async function authenticatedRequest(endpoint: string, method: "POST" | "PUT" | "DELETE", body?: Record<string | number | symbol, RecursiveObject<string | number | boolean>>, refresh: boolean = true): Promise<Record<string | number | symbol, RecursiveObject<string | number | boolean>> | GenericError> {
    const csrfCookie = getCookie(import.meta.env.VITE_CSRF_COOKIE_NAME)
    const accessToken = localStorage.getItem(import.meta.env.VITE_ACCESS_TOKEN_NAME)
    
    if (csrfCookie === null) {
        return {
            error: true,
            message: "Failed to get CSRF Token",
        } as GenericError
    }

    if (accessToken === null) {
        return {
            error: true,
            message: "Failed to get Access Token",
        } as GenericError
    }

    let response:  Record<string | number, string | number | boolean>
    
    try {
        response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
            method: method,
            credentials: 'include',
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "X-CSRFToken": csrfCookie
            },
            body: JSON.stringify(body)
        }).then(async middle => { 

            const reservedAuthStatusIndex: number = RESERVED_AUTH_STATUSES.findIndex(item => item.status === middle.status)
            
            if (reservedAuthStatusIndex !== -1) {
                switch (middle.status) {
                    case HTTP_401_UNAUTHORIZED: // Attempt to refresh access token on Unauthorized response
                        if (refresh) {
                            const refreshResponse = await authenticatedRequest(API_REFRESH_TOKENS, "POST", undefined, false)    // refresh = false, only attempt to refresh access token once

                            if (refreshResponse.error) {
                                clientSignOut()
                                return refreshResponse as GenericError
                            }
                            else {
                                localStorage.setItem(import.meta.env.VITE_ACCESS_TOKEN_NAME, (refreshResponse as Record<string | number, string | number | boolean>)[import.meta.env.VITE_ACCESS_TOKEN_NAME] as string)
                                return await authenticatedRequest(endpoint, method, undefined, false)   // Re-attempt original request (only once, refresh = false) if token refreshed successfully
                            }
                        }
                        else {  // token refresh failed once, log user out
                            clientSignOut()
                            return {
                                error: true,
                                message: "Log back in."
                            } as GenericError
                        }
                        break;
                    default:    // reserved responses other than the above handled cases always log user out
                        clientSignOut()
                        return {
                            error: true,
                            message: "Log back in."
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
            message: ((error as Error).message ? (error as Error).message : "Internal Server/Client Error")
        } as GenericError
    }

    return response
}
