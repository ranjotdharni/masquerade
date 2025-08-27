import { ICON_LOGO, PAGE_HOME } from "../../lib/constants"
import { useState, type MouseEvent } from "react"
import AppNavigation from "../utility/AppNavigation"
import NavigationOpener from "../utility/animated/NavigationOpener"

export default function AppHeader() {
    const [navigationOpen, setNavigationOpen] = useState<boolean>(false)

    function toggleNavigation(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        setNavigationOpen(previous => !previous)
    }

    return (
        <header className="absolute top-0 w-full h-[10vh] p-4 md:pr-10 flex flex-row justify-between items-center bg-primary">
            <a href={`/${PAGE_HOME}`} className="h-full flex flex-row items-center space-x-2 hover:cursor-pointer">
                <img className="h-full aspect-square" src={ICON_LOGO} alt='Logo' />
                <h1 className="text-xl md:text-3xl text-text font-jbm-bold">Masquerade</h1>
            </a>

            <button onClick={toggleNavigation} className="h-1/2 aspect-square hover:cursor-pointer">
                <NavigationOpener open={navigationOpen} />
            </button>

            <AppNavigation open={navigationOpen} />
        </header>
    )
}
