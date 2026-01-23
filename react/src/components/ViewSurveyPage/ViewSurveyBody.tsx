import { useState } from "react"
import type { Question } from "../../lib/types/api"
import QuestionViewer from "./viewer/QuestionViewer"
import InvitePanelViewer from "./viewer/InvitePanelViewer"

type ViewSurveyBodyProps = {
    invitePanelOpen: boolean
    questions: Question[]
}

export default function ViewSurveyBody({ invitePanelOpen, questions } : ViewSurveyBodyProps) {
    const [index, setIndex] = useState<number>(0)

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
                invitePanelOpen ? 
                <InvitePanelViewer /> :
                <QuestionViewer prev={cycleBackward} next={cycleForward} index={index} survey={questions} />
            }
        </section>
    )
}
