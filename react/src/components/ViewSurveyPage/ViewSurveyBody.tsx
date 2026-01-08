import type { Question } from "../../lib/types/api"

type ViewSurveyHeaderProps = {
    questions: Question[]
}

export default function ViewSurveyBody({ questions } : ViewSurveyHeaderProps) {
    console.log(questions.length)
    return (
        <section className="w-full h-3/4">

        </section>
    )
}
