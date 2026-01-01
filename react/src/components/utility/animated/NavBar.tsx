import { useState, type MouseEvent } from "react"
import { API_LOGOUT, ICON_LOGO, PAGE_HOME, PAGE_SURVEY_CREATE, PAGE_SURVEY_FIND } from "../../../lib/constants"
import "../../../css/animated.css"
import { ChevronLeft, CircleQuestionMark, HomeIcon, ListChecks, LogOut, MessageCircleWarning, Minimize, NotebookText, PencilRuler, Settings, TextSearch, type LucideIcon } from "lucide-react"
import { authenticatedRequest, clientSignOut } from "../../../lib/utility/internal"
import type { GenericError } from "../../../lib/types/internal"

const CLOSED_STATE: number = 0
const MINIMIZED_STATE: number = 1
const OPEN_STATE: number = 2

const NAVBAR_STATES = {
    CLOSED_STATE: 0,
    MINIMIZED_STATE: 1,
    OPEN_STATE: 2,
}

type NavbarStateType = typeof NAVBAR_STATES[keyof typeof NAVBAR_STATES]

function LinkItem({ text, href, open, Icon, close } : { text: string, href: string, open: boolean, Icon: LucideIcon, close: () => void }) {
    
    return (
        <div className="w-full">
            <a onClick={() => { close() }} href={href} className={`w-full md:h-full flex flex-row justify-start items-center hover:rounded-md ${open ? 'space-x-4' : 'hover:rounded-xl'} hover:cursor-pointer p-3 text-text hover:bg-secondary-light`}>
                <Icon className={`${open ? 'h-4 md:h-full' : 'w-full'} aspect-square`} />
                <p className={`${open ? '' : 'hidden'}`}>{text}</p>
            </a>
        </div>
    )
}

function ActionItem({ text, action, open, Icon } : { text: string, action: () => void, open: boolean, Icon: LucideIcon }) {
    return (
        <div className="w-full">
            <button onClick={e => { e.preventDefault(); action() }} className={`w-full md:h-full flex flex-row justify-start items-center hover:rounded-md ${open ? 'space-x-4' : 'hover:rounded-xl'} hover:cursor-pointer p-3 text-text hover:bg-secondary-light`}>
                <Icon className={`${open ? 'h-4 md:h-full' : 'w-full'} aspect-square`} />
                <p className={`${open ? '' : 'hidden'}`}>{text}</p>
            </button>
        </div>
    )
}

export default function NavBar() {
    const [barState, setBarState] = useState<NavbarStateType>(CLOSED_STATE)

    function fullOpen(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        setBarState(OPEN_STATE)
    }

    function minimize(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        setBarState(MINIMIZED_STATE)
    }

    function minimalClose() {
        setBarState(MINIMIZED_STATE)
    }

    function fullClose() {
        setBarState(CLOSED_STATE)
    }

    async function signOut() {
    
        const response = await authenticatedRequest(API_LOGOUT, "DELETE")
    
        if (response.error) {
            console.log((response as GenericError).message ? (response as GenericError).message : "500 Internal Server Error")
            return
        }
    
        clientSignOut()
    }

    return (
        <>
            <button onClick={fullOpen} className={`absolute mt-[1vh] ml-[1vh] h-[5vh] w-[5vh] md:w-auto md:h-[5vh] aspect-square rounded bg-primary p-2 hover:cursor-pointer hover:shadow-md navbarButton ${barState !== CLOSED_STATE ? 'md:navbarButtonClosed' : ''}`}>
                <img src={ICON_LOGO} className="w-full h-full" />
            </button>

            <nav className={`z-40 p-2 absolute h-screen md:h-[100vh] ${barState === OPEN_STATE ? 'w-full md:w-[12.5vw]' : 'translate-x-[-125%] md:translate-none md:w-[6.5vh]'} top-0 left-0 bg-primary flex flex-col justify-evenly md:justify-between navbar  ${barState === CLOSED_STATE ? 'navbarClosed' : ''}`}>
                <header className="w-full h-[5%] flex flex-row justify-center">
                    <div className={`${barState === OPEN_STATE ? 'w-4/5' : 'w-full'} h-full flex flex-row justify-start`}>
                        <img onClick={() => { setBarState(OPEN_STATE) }} src={ICON_LOGO} className={`${barState === OPEN_STATE ? 'h-full' : 'w-full max-w-[2.8vw]'} aspect-square hover:cursor-pointer`} />
                    </div>
                    <button onClick={minimize} className={`${barState === OPEN_STATE ? 'w-1/5' : 'hidden w-0'} flex flex-row justify-end items-center text-error hover:text-background hover:cursor-pointer`}>
                        <ChevronLeft />
                    </button>
                </header>

                <section className="w-full h-[50%] flex flex-col justify-evenly">
                    <LinkItem close={minimalClose} open={barState === OPEN_STATE} text="Home" Icon={HomeIcon} href={`/${PAGE_HOME}`} />
                    <LinkItem close={minimalClose} open={barState === OPEN_STATE} text="Create" Icon={PencilRuler} href={`/${PAGE_SURVEY_CREATE}`} />
                    <LinkItem close={minimalClose} open={barState === OPEN_STATE} text="Browse" Icon={TextSearch} href={`/${PAGE_SURVEY_FIND}`} />
                    <LinkItem close={minimalClose} open={barState === OPEN_STATE} text="My Surveys" Icon={ListChecks} href={`/${PAGE_SURVEY_FIND}`} />
                    <LinkItem close={minimalClose} open={barState === OPEN_STATE} text="Settings" Icon={Settings} href={`/${PAGE_HOME}`} />
                </section>

                <section  className="w-full h-[20%] flex flex-col justify-evenly">
                    <LinkItem close={minimalClose} open={barState === OPEN_STATE} text="Usage" Icon={NotebookText} href={`/${PAGE_HOME}`} />
                    <LinkItem close={minimalClose} open={barState === OPEN_STATE} text="About" Icon={CircleQuestionMark} href={`/${PAGE_HOME}`} />
                    <LinkItem close={minimalClose} open={barState === OPEN_STATE} text="Report" Icon={MessageCircleWarning} href={`/${PAGE_HOME}`} />
                </section>

                <footer className="w-full h-[15%] flex flex-col justify-evenly">
                    <ActionItem open={barState === OPEN_STATE} text="Sign Out" Icon={LogOut} action={async () => { await signOut() }} />
                    <ActionItem open={barState === OPEN_STATE} text="Close" Icon={Minimize} action={fullClose} />
                </footer>
            </nav>
        </>
    )
}
