import { useState, type JSX } from "react"
import type { Question } from "../../../lib/types/api"
import QuestionViewer from "../viewer/QuestionViewer"
import InvitePanelViewer from "../viewer/InvitePanelViewer"
import { MODE_INVITE, MODE_VIEW, type ModeId } from "../PageCoordinator"

type ViewSurveyBodyProps = {
    questions: Question[]
    mode: ModeId
}

export default function ViewSurveyBody({ questions, mode } : ViewSurveyBodyProps) {
    const [index, setIndex] = useState<number>(0)

    const ModeMap: Record<ModeId, JSX.Element | JSX.Element[]> = {
        [MODE_VIEW]: <QuestionViewer prev={cycleBackward} next={cycleForward} index={index} survey={questions} />,
        [MODE_INVITE]: <InvitePanelViewer />,
    }

    function cycleForward() {
        setIndex(prev => {
            return (prev + 1 > questions.length - 1 ? 0 : prev + 1)
        })
    }

    function cycleBackward() {
        setIndex(prev => {
            return (prev - 1 < 0 ? questions.length - 1 : prev - 1)
        })
    }

    return (
        <section className="w-full h-3/4">
            {
                ModeMap[mode]
            }
        </section>
    )
}
