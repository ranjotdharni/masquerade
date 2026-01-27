import type { SingleChoiceQuestion } from "../../../lib/types/api"

export type SingleChoiceStatViewProps = {
    question: SingleChoiceQuestion
}

export default function SingleChoiceStatView({ question } : SingleChoiceStatViewProps) {

    return (
        <div>
            {question.question}
        </div>
    )
}
