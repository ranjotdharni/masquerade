import type { Question } from "../../lib/types/api"
import QuestionViewer from "./viewer/QuestionViewer"

type ViewSurveyBodyProps = {
    questions: Question[]
}

export default function ViewSurveyBody({ questions } : ViewSurveyBodyProps) {

    return (
        <QuestionViewer survey={questions} />
    )
}
