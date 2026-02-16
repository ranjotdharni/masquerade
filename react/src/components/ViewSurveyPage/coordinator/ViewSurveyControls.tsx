import { useContext, type MouseEvent } from "react"
import { NAV_CSS } from "../../utility/animated/NavBar"
import { type ModeId, type ModeMetadata } from "../PageCoordinator"
import { API_SURVEY_DELETE, APP_NAME, DEFAULT_ERROR_MESSAGE, PAGE_SURVEY_STATISTICS, PAGE_SURVEY_VIEW } from "../../../lib/constants"
import { UIContext } from "../../context/UIContext"
import { authenticatedRequest } from "../../../lib/utility/internal"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

type ViewSurveyControlsProps = {
    surveyId: string
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

export default function ViewSurveyControls({ surveyId, mode, setMode, modeMetadata } : ViewSurveyControlsProps) {
    let navigate = useNavigate()
    const authentication = useContext(AuthContext)
    const { confirm, notify } = useContext(UIContext)

    function changeMode(mode: ModeId) {
        return (event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault()
            setMode(mode)
        }
    }

    async function deleteSurvey() {
        await authenticatedRequest(authentication, API_SURVEY_DELETE, "DELETE", { id: surveyId }).then(result => {
            let message = result.message as string || DEFAULT_ERROR_MESSAGE

            if (result.error) {
                notify({
                    message: message,
                    color: "var(--color-error)"
                })
            }
            else {
                notify({
                    message: message,
                    color: "var(--color-text)"
                })

                navigate(`/${PAGE_SURVEY_VIEW}`)
            }
        })
    }

    async function onDelete(event: MouseEvent) {
        event.preventDefault()

        confirm({
            message: `Warning: In the current state of ${APP_NAME}, survey deletion is COMPLETELY IRREVERSIBLE! Understanding this, would you still like to continue?`,
            callback: deleteSurvey,
            loaderText: "Deleting Survey..."
        })
    }

    return (
        <section className={`w-full h-[15%] p-4 ${NAV_CSS.pl} border-b border-primary flex flex-row justify-between items-end`}>
            <div className="-ml-4 md:ml-2 space-x-2 flex flex-row">
                {
                    modeMetadata.map(metadata => {
                        return <ModeSelect key={`MODE_META_1x${metadata.id}`} active={mode === metadata.id} metadata={metadata} changeMode={changeMode(metadata.id)} />
                    })
                }
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <Link to={`/${PAGE_SURVEY_STATISTICS}/${surveyId}`} className="appButton w-26 px-0! py-0! flex justify-center">Statistics</Link>
                <button onClick={onDelete} className="w-26 py-0 bg-error text-accent rounded hover:text-background hover:cursor-pointer">Delete</button>
            </div>
        </section>
    )
}
