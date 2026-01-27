import type { RankingQuestion } from "../../../lib/types/api"

export type RankingStatViewProps = {
    question: RankingQuestion
}

export default function RankingStatView({ question } : RankingStatViewProps) {

    return (
        <div>
            {question.question}
        </div>
    )
}
