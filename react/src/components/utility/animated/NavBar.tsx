import { ChevronLeft, CircleQuestionMark, HomeIcon, ListChecks, LogOut, MessageCircleWarning, Minimize, NotebookText, PencilRuler, SunMoon, TextSearch, type LucideIcon } from "lucide-react"
import { API_LOGOUT, EXTERNAL_GITHUB_ISSUES, ICON_LOGO, PAGE_ABOUT, PAGE_HOME, PAGE_SURVEY_CREATE, PAGE_SURVEY_FIND, PAGE_SURVEY_VIEW, PAGE_USAGE } from "../../../lib/constants"
import { authenticatedRequest, clientSignOut } from "../../../lib/utility/internal"
import type { GenericError } from "../../../lib/types/internal"
import { useState, type MouseEvent } from "react"
import "../../../css/animated.css"

type NavCSSType = {
    spaceX: string
    spaceY: string
    unitsX: string
    unitsY: string

    w: string
    h: string

    w_diff: string
    h_diff: string

    px: string
    py: string
    pl: string
    pt: string
    pr: string
    pb: string
    mx: string
    my: string
    ml: string
    mt: string
    mr: string
    mb: string

    md_w: string
    md_h: string

    md_w_diff: string
    md_h_diff: string

    md_px: string
    md_py: string
    md_pl: string
    md_pt: string
    md_pr: string
    md_pb: string
    md_mx: string
    md_my: string
    md_ml: string
    md_mt: string
    md_mr: string
    md_mb: string

    getX: (add?: number) => string,
    getY: (add?: number) => string,
}

export const NAV_CSS: NavCSSType = {
    spaceX: "6.5",
    spaceY: "6",
    unitsX: "vh",
    unitsY: "vh",

    w: "w-[6.5vh]",
    h: "h-[6vh]",

    w_diff: "w-[calc(100%-6.5vh)]",
    h_diff: "h-[calc(100%-6vh)]",

    px: "px-[6.5vh]",
    pl: "pl-[6.5vh]",
    pr: "pr-[6.5vh]",
    py: "py-[6vh]",
    pt: "pt-[6vh]",
    pb: "pb-[6vh]",

    mx: "mx-[6.5vh]",
    ml: "ml-[6.5vh]",
    mr: "mr-[6.5vh]",
    my: "my-[6vh]",
    mt: "mt-[6vh]",
    mb: "mb-[6vh]",

    md_w: "md:w-[6.5vh]",
    md_h: "md:h-[6vh]",

    md_w_diff: "md:w-[calc(100%-6.5vh)]",
    md_h_diff: "md:h-[calc(100%-6vh)]",

    md_px: "md:px-[6.5vh]",
    md_pl: "md:pl-[6.5vh]",
    md_pr: "md:pr-[6.5vh]",
    md_py: "md:py-[6vh]",
    md_pt: "md:pt-[6vh]",
    md_pb: "md:pb-[6vh]",

    md_mx: "md:mx-[6.5vh]",
    md_ml: "md:ml-[6.5vh]",
    md_mr: "md:mr-[6.5vh]",
    md_my: "md:my-[6vh]",
    md_mt: "md:mt-[6vh]",
    md_mb: "md:mb-[6vh]",

    getX: (add?: number) => {
        let u: number = 6.5 + (add ? add : 0)
        return `${u}vh`
    },

    getY: (add?: number) => {
        let u: number = 6 + (add ? add : 0)
        return `${u}vh`
    },
}

const CLOSED_STATE: number = 0
const MINIMIZED_STATE: number = 1
const OPEN_STATE: number = 2

const NAVBAR_STATES = {
    CLOSED_STATE: 0,
    MINIMIZED_STATE: 1,
    OPEN_STATE: 2,
}

type NavbarStateType = typeof NAVBAR_STATES[keyof typeof NAVBAR_STATES]

function LinkItem({ text, href, open, Icon, close, hoverContent, external } : { text: string, href: string, open: boolean, Icon: LucideIcon, close: () => void, hoverContent: string, external?: boolean }) {
    
    let tailwind = `
        w-full md:h-full flex flex-row justify-start items-center hover:rounded-md ${open ? 'space-x-4' : 'hover:rounded-xl'} hover:cursor-pointer p-3 text-text hover:bg-secondary-light after:content-[attr(data-tooltip)]
        after:left-[90%] after:rounded after:border-accent after:bg-text after:text-background after:px-2 tooltip
    `

    return (
        <div className="w-full">
            <a onClick={() => { close() }} href={href} data-tooltip={open ? "" : hoverContent} className={tailwind} target={external ? "_blank" : "_self"}>
                <Icon className={`${open ? 'h-4 md:h-full' : 'w-full'} aspect-square`} />
                <p className={`${open ? '' : 'hidden'}`}>{text}</p>
            </a>
        </div>
    )
}

function ActionItem({ text, action, open, Icon, hoverContent } : { text: string, action: () => void, open: boolean, Icon: LucideIcon, hoverContent: string }) {
    let tailwind = `
        w-full md:h-full flex flex-row justify-start items-center hover:rounded-md ${open ? 'space-x-4' : 'hover:rounded-xl'} hover:cursor-pointer p-3 text-text hover:bg-secondary-light after:content-[attr(data-tooltip)]
        after:left-[90%] after:rounded after:border-accent after:bg-text after:text-background after:px-2 tooltip
    `

    return (
        <div className="w-full">
            <button onClick={e => { e.preventDefault(); action() }} data-tooltip={open ? "" : hoverContent} className={tailwind}>
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

    function minimalClose(event?: MouseEvent<HTMLButtonElement>) {
        if (event)
            event.preventDefault()
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

            <nav className={`z-40 p-2 absolute h-screen md:h-[100vh] ${barState === OPEN_STATE ? 'w-full md:w-[12.5vw]' : `translate-x-[-125%] md:translate-none ${NAV_CSS.md_w}`} top-0 left-0 bg-primary flex flex-col justify-evenly md:justify-between navbar ${barState === CLOSED_STATE ? 'navbarClosed' : ''}`}>
                <header className="w-full h-[5%] flex flex-row justify-center">
                    <div className={`${barState === OPEN_STATE ? 'w-4/5' : 'w-full'} h-full flex flex-row justify-start`}>
                        <img onClick={() => { setBarState(OPEN_STATE) }} src={ICON_LOGO} className={`${barState === OPEN_STATE ? 'h-full' : 'w-full max-w-[2.8vw]'} aspect-square hover:cursor-pointer`} />
                    </div>
                    <button onClick={minimalClose} className={`${barState === OPEN_STATE ? 'w-1/5' : 'hidden w-0'} flex flex-row justify-end items-center text-error hover:text-background hover:cursor-pointer`}>
                        <ChevronLeft />
                    </button>
                </header>

                <section className="w-full h-[50%] flex flex-col justify-evenly overflow-hidden">
                    <LinkItem close={minimalClose} open={barState === OPEN_STATE} hoverContent='Home' text="Home" Icon={HomeIcon} href={`/${PAGE_HOME}`} />
                    <LinkItem close={minimalClose} open={barState === OPEN_STATE} hoverContent='Create' text="Create" Icon={PencilRuler} href={`/${PAGE_SURVEY_CREATE}`} />
                    <LinkItem close={minimalClose} open={barState === OPEN_STATE} hoverContent='Browse' text="Browse" Icon={TextSearch} href={`/${PAGE_SURVEY_FIND}`} />
                    <LinkItem close={minimalClose} open={barState === OPEN_STATE} hoverContent='My Surveys' text="My Surveys" Icon={ListChecks} href={`/${PAGE_SURVEY_VIEW}`} />
                    <ActionItem open={barState === OPEN_STATE} hoverContent='Theme' text="Toggle Theme" Icon={SunMoon} action={() => {}} />
                </section>

                <section  className="w-full h-[20%] flex flex-col justify-evenly overflow-hidden">
                    <LinkItem close={minimalClose} open={barState === OPEN_STATE} hoverContent='Usage' text="Usage" Icon={NotebookText} href={`/${PAGE_USAGE}`} />
                    <LinkItem close={minimalClose} open={barState === OPEN_STATE} hoverContent='About' text="About" Icon={CircleQuestionMark} href={`/${PAGE_ABOUT}`} />
                    <LinkItem close={minimalClose} open={barState === OPEN_STATE} hoverContent='Report' text="Report" Icon={MessageCircleWarning} href={EXTERNAL_GITHUB_ISSUES} external />
                </section>

                <footer className="w-full h-[15%] flex flex-col justify-evenly overflow-hidden">
                    <ActionItem open={barState === OPEN_STATE}  hoverContent='Sign Out' text="Sign Out" Icon={LogOut} action={async () => { await signOut() }} />
                    <ActionItem open={barState === OPEN_STATE}  hoverContent='Close' text="Close" Icon={Minimize} action={fullClose} />
                </footer>
            </nav>
        </>
    )
}
