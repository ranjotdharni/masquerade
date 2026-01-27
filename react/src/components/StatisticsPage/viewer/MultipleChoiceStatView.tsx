import type { MultipleChoiceQuestion } from "../../../lib/types/api"

export type MultipleChoiceStatViewProps = {
    question: MultipleChoiceQuestion
}

export default function MultipleChoiceStatView({ question } : MultipleChoiceStatViewProps) {

    return (
        <div>
            {question.question}
        </div>
    )
}
