import { List, LogOut, Settings2, UserPen, type LucideIcon } from "lucide-react"
import { API_LOGOUT, PAGE_HOME, PAGE_LOGIN } from "../../lib/constants"
import type { MouseEvent } from "react"
import { useNavigate } from "react-router-dom"
import { authenticatedRequest, clientSignOut } from "../../lib/utility/internal"
import type { GenericError } from "../../lib/types/internal"

type AppNavigationProps = {
    open: boolean
}

type NavigationPage = {
    name: string
    link: string
    index?: number
    open?: boolean
    Icon: LucideIcon
    callback?: (event: MouseEvent<HTMLAnchorElement>) => void
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
    {
        name: "Sign Out",
        link: `/${PAGE_LOGIN}`,
        Icon: LogOut,
        callback: signOut
    },
]

async function signOut(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()

    const response = await authenticatedRequest(API_LOGOUT, "DELETE")

    if (response.error) {
        console.log((response as GenericError).message ? (response as GenericError).message : "500 Internal Server Error")
        return
    }

    clientSignOut()
}

function NavigationItem({ name, link, open, index, Icon, callback } : NavigationPage) {

    const navigate = useNavigate()

    return (
        <a 
            onClick={ callback !== undefined ? (e) => { callback(e) } : () => { navigate(link) } } 
            style={{["--index" as any]: index ? index : 0}}
            className={`${open ? "appNavigationItemOpen" : "appNavigationItemClosed"} rounded-lg border border-accent z-20 hover:bg-accent hover:cursor-pointer relative h-12 w-full flex flex-row justify-center space-x-2 items-center text-xl font-roboto md:text-md`}
        >
            <Icon className="text-text" />
            <p>{name}</p>
        </a>
    )
}

export default function AppNavigation({ open } : AppNavigationProps) {

    return (
        <
            nav 
            className="absolute top-[10vh] left-0 w-full flex flex-col justify-evenly items-center md:w-[20%] md:left-[80%] md:px-4 overflow-hidden appNavigation" 
            style={{height: `${(pages.length * 3) + 2}rem`, zIndex: open ? 20 : "auto"}}
        >
            {
                pages.map((page, index) => {
                    return <NavigationItem key={`NAVIGATION_ITEM_${index}`} index={index} name={page.name} link={page.link} open={open} Icon={page.Icon} callback={page.callback} />
                })
            }
        </nav>
    )
}
