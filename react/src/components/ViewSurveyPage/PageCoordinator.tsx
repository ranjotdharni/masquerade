import { useState } from "react"
import type { Survey } from "../../lib/types/api"
import ViewSurveyHeader from "./coordinator/ViewSurveyHeader"
import ViewSurveyControls from "./coordinator/ViewSurveyControls"
import ViewSurveyBody from "./coordinator/ViewSurveyBody"
import { Eye, EyeClosed, Mail, MailOpen, type LucideIcon } from "lucide-react"

export const MODE_VIEW = 0
export const MODE_INVITE = 1

const MODE_ID_MAP = {
    VIEW: MODE_VIEW,
    INVITE: MODE_INVITE,
} as const

export type ModeId = typeof MODE_ID_MAP[keyof typeof MODE_ID_MAP]
export type ModeMetadata = {
    id: ModeId
    text: string
    Icon: LucideIcon
    ActiveIcon: LucideIcon
}

const metadata: ModeMetadata[] = [
    {
        id: MODE_VIEW,
        text: "View",
        Icon: EyeClosed,
        ActiveIcon: Eye,
    },
    {
        id: MODE_INVITE,
        text: "Invite",
        Icon: Mail,
        ActiveIcon: MailOpen,
    }
]

export default function PageCoordinator({ content } : { content: Survey }) {
    const [mode, setMode] = useState<ModeId>(MODE_VIEW)
    
    return (
        <>
            <ViewSurveyHeader name={content.name} inviteOnly={content.inviteOnly} />
            <ViewSurveyControls mode={mode} setMode={setMode} modeMetadata={metadata} />
            <ViewSurveyBody mode={mode} questions={content.questions} />
        </>
    )
}
