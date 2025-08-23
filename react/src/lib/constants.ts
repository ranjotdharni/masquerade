
export const PAGE_WELCOME: string = '/'
export const PAGE_LOGIN: string = 'login'
export const PAGE_HOME: string = 'home' // child routes (nested in app layout) should not have leading slashes

export const API_GOOGLE_LOGIN: string = '/api/auth/google/init/'
export const API_GITHUB_LOGIN: string = '/api/auth/github/init/'
export const API_BASIC_SIGNUP: string = '/api/auth/basic/signup/'
export const API_BASIC_SIGNIN: string = '/api/auth/basic/signin/'
export const API_LOGOUT: string = '/api/auth/signout/'
export const API_REFRESH_TOKENS: string = '/api/auth/refresh/'
export const API_CONFIRM_AUTH: string = '/api/auth/confirm/'

export const ICON_LOGO: string = 'https://img.icons8.com/color/100/venetian-mask.png'
export const ICON_LOGO_STICKER: string = 'https://img.icons8.com/stickers/100/venetian-mask.png'

export const HTTP_401_UNAUTHORIZED: number = 401
export const HTTP_403_FORBIDDEN: number = 403

export const RESERVED_AUTH_STATUSES: { status: number, message: string }[] = [
    {
        status: HTTP_401_UNAUTHORIZED,
        message: "401 Unauthorized (bad access token, no access token, or improperly passed access token)" // can also be triggered by missing or invalid refresh token
    },
    {
        status: HTTP_403_FORBIDDEN,
        message: "403 Forbidden (bad CSRF token or no CSRF token)"
    },
]

export const BASIC_AUTH_ID: number = 0
export const GOOGLE_AUTH_ID: number = 1
export const GITHUB_AUTH_ID: number = 2

export const AUTH_ID_LIST: Record<number, string> = {
    [BASIC_AUTH_ID]: "Email/Password",
    [GOOGLE_AUTH_ID]: "Google",
    [GITHUB_AUTH_ID]: "Github",
}

export const DUPLICATE_USER_CODE: number = 409

export const PASSWORD_MIN_LENGTH: number = 12
