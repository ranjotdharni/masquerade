import type { MouseEvent } from "react"
import { NAV_CSS } from "../../utility/animated/NavBar"
import { Mail, MailOpen, type LucideIcon } from "lucide-react"
import { MODE_INVITE, type ModeId, type ModeMetadata } from "../PageCoordinator"

type ViewSurveyControlsProps = {
    mode: ModeId
    setMode: (mode: ModeId) => void
    modeMetadata: ModeMetadata[]
}

type ModeSelectProps = {
    active: boolean
    metadata: ModeMetadata
    changeMode: (event: MouseEvent<HTMLButtonElement>) => void
}

function ModeSelect({ active, metadata, changeMode } : ModeSelectProps) {
    let Icon = metadata.Icon
    let ActiveIcon = metadata.ActiveIcon
    
    return (
        <button 
            onClick={changeMode} 
            style={active ? {backgroundColor: "var(--color-text)", color: "var(--color-accent)"} : {}} 
            className="flex flex-row items-center text-nowrap space-x-2 py-1 px-2 rounded text-sm font-jbm bg-inactive-light text-text hover:bg-accent hover:cursor-pointer"
        >
            {
                active ? 
                <ActiveIcon /> :
                <Icon />
            }
            <p>{metadata.text}</p>
        </button>
    )
}

export default function ViewSurveyControls({ mode, setMode, modeMetadata } : ViewSurveyControlsProps) {

    function changeMode(mode: ModeId) {
        return (event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault()
            setMode(mode)
        }
    }

    return (
        <section className={`w-full h-[15%] p-4 ${NAV_CSS.pl} border-b border-primary flex flex-row justify-between items-end`}>
            <div className="-ml-4 md:-ml-0 md:ml-2 space-x-2 flex flex-row">
                {
                    modeMetadata.map(metadata => {
                        return <ModeSelect key={`MODE_META_1x${metadata.id}`} active={mode === metadata.id} metadata={metadata} changeMode={changeMode(metadata.id)} />
                    })
                }
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <button className="appButton w-26 px-0! py-0!">Statistics</button>
                <button className="w-26 py-0 bg-error text-accent rounded hover:text-background hover:cursor-pointer">Delete</button>
            </div>
        </section>
    )
}
