import { ICON_LOGO } from "../../lib/constants"
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
            <div className="h-full flex flex-row items-center space-x-2">
                <img className="h-full aspect-square" src={ICON_LOGO} alt='Logo' />
                <h1 className="text-xl md:text-3xl text-text font-jbm-bold">Masquerade</h1>
            </div>

            <button onClick={toggleNavigation} className="h-1/2 aspect-square hover:cursor-pointer">
                <NavigationOpener open={navigationOpen} />
            </button>

            <AppNavigation open={navigationOpen} />
        </header>
    )
}
