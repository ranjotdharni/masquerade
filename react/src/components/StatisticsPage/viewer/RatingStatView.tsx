import type { RatingQuestion } from "../../../lib/types/api"

export type RatingStatViewProps = {
    question: RatingQuestion
}

export default function RatingStatView({ question } : RatingStatViewProps) {

    return (
        <div>
            {question.question}
        </div>
    )
}
