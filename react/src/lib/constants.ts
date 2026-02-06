import { Check, CircleDot, HandCoins, Star } from "lucide-react"
import type { QuestionClassification, QuestionIdType, UniformArticleIDType } from "./types/client"

export const APP_NAME: string = 'Masquerades'
export const DEFAULT_ERROR_MESSAGE: string = 'Uknown Error Occurred'

export const PAGE_WELCOME: string = '/'
export const PAGE_LOGIN: string = 'login'
export const PAGE_ABOUT: string = 'about'
export const PAGE_USAGE: string = 'usage'
export const PAGE_HOME: string = 'home' // child routes (nested in app layout) should not have leading slashes
export const PAGE_SURVEY_CREATE: string = 'survey/create'
export const PAGE_SURVEY_FIND: string = 'survey/find'
export const PAGE_SURVEY_PREVIEW: string = 'survey/preview'
export const PAGE_SURVEY_TAKE: string = 'survey/take'
export const PAGE_SURVEY_SUBMITTED: string = 'survey/submitted'
export const PAGE_SURVEY_VIEW: string = 'survey/view'
export const PAGE_SURVEY_STATISTICS: string = 'survey/stats'

export const API_GOOGLE_LOGIN: string = '/api/auth/google/init/'
export const API_GITHUB_LOGIN: string = '/api/auth/github/init/'
export const API_BASIC_SIGNUP: string = '/api/auth/basic/signup/'
export const API_BASIC_SIGNIN: string = '/api/auth/basic/signin/'
export const API_LOGOUT: string = '/api/auth/signout/'
export const API_REFRESH_TOKENS: string = '/api/auth/refresh/'
export const API_CONFIRM_AUTH: string = '/api/auth/confirm/'
export const API_SURVEY_CREATE: string = '/api/survey/create/'
export const API_SURVEY_DELETE: string = '/api/survey/delete/'
export const API_SURVEY_CATALOG: string = '/api/survey/catalog/'
export const API_SURVEY_DETAIL: string = '/api/survey/detail/'
export const API_SURVEY_SUBMIT: string = '/api/survey/submit/'
export const API_INVITE_SEND: string = '/api/invite/send/'
export const API_INVITE_RECEIVED: string = '/api/invite/received/'
export const API_INVITE_DECLINE: string = '/api/invite/decline/'

export const EXTERNAL_GITHUB_SOURCE: string = 'https://github.com/ranjotdharni/masquerade'
export const EXTERNAL_GITHUB_ISSUES: string = 'https://github.com/ranjotdharni/masquerade/issues'
export const EXTERNAL_GITHUB_PULL_REQUEST: string = 'https://github.com/ranjotdharni/masquerade/pulls'

export const ICON_LOGO: string = 'https://img.icons8.com/color/100/venetian-mask.png'
export const ICON_LOGO_STICKER: string = 'https://img.icons8.com/stickers/100/venetian-mask.png'
export const ICON_QUESTION_MARK: string = 'https://img.icons8.com/emoji/100/question-mark-emoji.png'
export const ICON_APEXCHARTS: string = 'https://apexcharts.com/wp-content/themes/apexcharts/img/apexcharts-logo.svg'
export const ICON_REACT: string = 'https://icon.icepanel.io/Technology/svg/React.svg'
export const ICON_DJANGO: string = 'https://icon.icepanel.io/Technology/png-shadow-512/Django.png'
export const ICON_MONGO: string = 'https://icon.icepanel.io/Technology/svg/MongoDB.svg'
export const ICON_OAUTH: string = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Oauth_logo.svg/960px-Oauth_logo.svg.png?20210406125156'
export const ICON_GROUP: string = 'https://img.icons8.com/color/100/you-plural.png'
export const ICON_DATA: string = 'https://img.icons8.com/color/100/combo-chart--v1.png'
export const ICON_ANONYMOUS: string = 'https://img.icons8.com/color/100/anonymous-mask.png'
export const ICON_UI: string = 'https://img.icons8.com/color/100/web.png'

export const IMG_LANDING_BACKGROUND: string = 'https://images.pexels.com/photos/28428591/pexels-photo-28428591.jpeg'
export const IMG_LANDING_TARGET_AUDIENCE: string = 'https://images.unsplash.com/photo-1599592187465-6dc742367282?q=80&w=1470&auto=format&fit=crop'
export const IMG_LANDING_USER_PRIVACY: string = 'https://images.unsplash.com/photo-1461685265823-f8d5d0b08b9b?q=80&w=1470&auto=format&fit=crop'
export const IMG_LANDING_DATA_VISUALIZATION: string = 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?q=80&w=1474&auto=format&fit=crop'
export const IMG_LANDING_SIGN_UP: string = 'https://images.pexels.com/photos/5429120/pexels-photo-5429120.jpeg'
export const IMG_LANDING_EASY_TO_USE: string = 'https://images.pexels.com/photos/5922546/pexels-photo-5922546.jpeg'
export const IMG_LANDING_MEANINGFUL_DATA: string = 'https://images.pexels.com/photos/5990975/pexels-photo-5990975.jpeg'
export const IMG_LANDING_STATISTICS_DASHBOARD: string = 'https://res.cloudinary.com/ddxyscqzm/image/upload/v1770281273/statisticsScreenshot1_uvop9a.png'

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

export const QUESTION_TYPE_ID_MAP = {
    SINGLE_CHOICE_TYPE: 1,
    MULTIPLE_CHOICE_TYPE: 2,
    RANKING_TYPE: 3,
    RATING_TYPE: 4,
} as const

export const MAX_ANSWERS_PER_QUESTION = 4
export const MAX_QUESTIONS_PER_SURVEY = 10

export const SURVEY_TYPE_TO_ICON: Record<QuestionIdType, QuestionClassification> = {
    [QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE]: {
        title: "Multiple Choice",
        Icon: CircleDot,
    },
    [QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE]:  {
        title: "Check List",
        Icon: Check,
    },
    [QUESTION_TYPE_ID_MAP.RANKING_TYPE]:  {
        title: "Ranking",
        Icon: HandCoins,
    },
    [QUESTION_TYPE_ID_MAP.RATING_TYPE]:  {
        title: "Rating",
        Icon: Star,
    },
}

export const SINGLE_IMAGE_UNIFORM_ARTICLE_ID: 0 = 0 as const
export const DUAL_IMAGE_UNIFORM_ARTICLE_ID: 1 = 1 as const

export const DIFF_COLOR_LIST: string[] = [ 
  "#be2f13",
  "#56554f",
  "#7352c1",
  "#359985",
  "#F28E2B",
  "#D37295",
  "#4E79A7",
  "#59A14F",
  "#9C755F",
  "#B07AA1",
  "#EDC948",
  "#2F6F62",
]
