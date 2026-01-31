import { CircleQuestionMark, DoorOpen, KeyRound, NotebookText, type LucideIcon } from "lucide-react"
import { APP_NAME, ICON_LOGO, PAGE_LOGIN, PAGE_WELCOME } from "../../lib/constants"

type NavigationItemType = {
    href: string
    text: string
    Icon: LucideIcon
}

const NAVIGATION_ITEMS: NavigationItemType[] = [
    {
        text: "Log In",
        href: `/${PAGE_LOGIN}`,
        Icon: KeyRound,
    },
    {
        text: "Sign Up",
        href: `/${PAGE_LOGIN}`,
        Icon: DoorOpen,
    },
    {
        text: "Usage",
        href: `/${PAGE_WELCOME}`,
        Icon: NotebookText,
    },
    {
        text: "About",
        href: `/${PAGE_WELCOME}`,
        Icon: CircleQuestionMark,
    },
]

function NavigationLink({ text, href, Icon } : NavigationItemType) {
    return (
        <a href={href} className="w-full h-full px-1 space-x-1 md:space-x-2 flex flex-row justify-center items-center hover:text-accent">
            <Icon />
            <span className="whitespace-nowrap">{text}</span>
        </a>
    )
}

export default function BaseHeader() {
    return (
        <header style={{zIndex: 5}} className="sticky top-0 w-full md:max-h-24 md:px-8 py-4 md:pr-20 space-y-2 md:space-y-0 flex flex-col md:flex-row justify-between items-center bg-primary">
            <h1 className="w-full md:w-auto px-4 md:px-0">
                <a href={PAGE_WELCOME} className="h-full flex flex-row justify-center items-center space-x-2">
                    <img className="h-16 aspect-square" src={ICON_LOGO} alt='Logo' />
                    <span className="text-xl md:text-2xl text-text font-jbm-bold">{APP_NAME}</span>
                </a>
            </h1>

            <nav className="w-full px-2 md:px-0 md:w-auto space-x-6 md:space-x-8 font-jbm text-sm md:text-[1rem] text-text flex flex-row justify-center md:justify-start items-center">
                {
                    NAVIGATION_ITEMS.map((navItem, index) => {
                        return <NavigationLink key={`BASE_NAV_LINK_1x${index}`} text={navItem.text} href={navItem.href} Icon={navItem.Icon} />
                    })
                }
            </nav>
        </header>
    )
}
