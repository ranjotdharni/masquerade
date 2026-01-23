import type { MouseEvent } from "react"
import { NAV_CSS } from "../utility/animated/NavBar"
import { Mail, MailOpen } from "lucide-react"

type ViewSurveyControlsProps = {
    invitePanelOpen: boolean
    toggleInvitePanel: (event: MouseEvent<HTMLButtonElement>) => void
}

export default function ViewSurveyControls({ invitePanelOpen, toggleInvitePanel } : ViewSurveyControlsProps) {

    return (
        <section className={`w-full h-[15%] p-4 ${NAV_CSS.pl} border-b border-primary flex flex-row justify-between items-end`}>
            <div className="-ml-4 md:-ml-0 md:ml-2">
                <button 
                    onClick={toggleInvitePanel} 
                    style={invitePanelOpen ? {backgroundColor: "var(--color-text)", color: "var(--color-accent)"} : {}} 
                    className="flex flex-row items-center text-nowrap space-x-2 py-1 px-2 rounded text-sm font-jbm bg-inactive-light text-text hover:bg-accent hover:cursor-pointer"
                >
                    {
                        invitePanelOpen ? 
                        <MailOpen /> :
                        <Mail />
                    }
                    <p>Invite</p>
                </button>
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <button className="appButton w-26 px-0! py-0!">Statistics</button>
                <button className="w-26 py-0 bg-error text-accent rounded hover:text-background hover:cursor-pointer">Delete</button>
            </div>
        </section>
    )
}
