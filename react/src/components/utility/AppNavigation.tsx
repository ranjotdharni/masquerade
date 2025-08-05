import { List, Settings2, UserPen, type LucideIcon } from "lucide-react"
import { PAGE_HOME } from "../../lib/constants"

type AppNavigationProps = {
    open: boolean
}

type NavigationPage = {
    name: string
    link: string
    Icon: LucideIcon
}

const pages: NavigationPage[] = [
    {
        name: 'Profile',
        link: `/${PAGE_HOME}`,
        Icon: UserPen
    },
    {
        name: 'Surveys',
        link: `/${PAGE_HOME}`,
        Icon: List
    },
    {
        name: 'Settings',
        link: `/${PAGE_HOME}`,
        Icon: Settings2
    },
]

function NavigationItem({ name, link, Icon } : NavigationPage) {

    return (
        <a className="relative h-12 w-full flex flex-row justify-start pl-42 md:pl-32 space-x-2 items-center text-xl font-roboto hover:bg-accent md:text-md" href={link}>
            <Icon className="text-text" />
            <p>{name}</p>
        </a>
    )
}

export default function AppNavigation({ open } : AppNavigationProps) {

    return (
        <
            nav 
            className="absolute top-[10vh] left-0 w-full flex-col justify-start border border-accent md:w-1/5 md:left-4/5 overflow-hidden appNavigation" 
            style={{opacity: open ? 1 : 0, height: open ? `${pages.length * 3}rem` : 0}}
        >
            {
                pages.map((page, index) => {
                    return <NavigationItem key={`NAVIGATION_ITEM_${index}`} name={page.name} link={page.link} Icon={page.Icon} />
                })
            }
        </nav>
    )
}
