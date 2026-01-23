import { useState, type MouseEvent } from "react"
import type { Survey } from "../../lib/types/api"
import ViewSurveyHeader from "./coordinator/ViewSurveyHeader"
import ViewSurveyControls from "./coordinator/ViewSurveyControls"
import ViewSurveyBody from "./coordinator/ViewSurveyBody"



export default function PageCoordinator({ content } : { content: Survey }) {
    const [invitePanelOpen, setInvitePanelOpen] = useState<boolean>(false)

    function toggleInvitePanel(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        setInvitePanelOpen(prev => !prev)
    }
    
    return (
        <>
            <ViewSurveyHeader name={content.name} inviteOnly={content.inviteOnly} />
            <ViewSurveyControls invitePanelOpen={invitePanelOpen} toggleInvitePanel={toggleInvitePanel} />
            <ViewSurveyBody invitePanelOpen={invitePanelOpen} questions={content.questions} />
        </>
    )
}
