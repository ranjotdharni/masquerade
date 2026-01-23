import { useState, type MouseEvent } from "react"
import type { Survey } from "../../lib/types/api"

import ViewSurveyBody from "./ViewSurveyBody"
import ViewSurveyControls from "./ViewSurveyControls"
import ViewSurveyHeader from "./ViewSurveyHeader"



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
