import { type JSX } from "react"
import type { ChoiceQuestionType, QuestionIdType, TextQuestionType } from "../../lib/types/client"
import { QUESTION_TYPE_ID_MAP } from "../../lib/constants"
import SingleChoice from "./SingleChoice"
import MultipleChoice from "./MultipleChoice"
import WrittenQuestion from "./WrittenQuestion"

type QuestionCreatorProps = {
    slug: ChoiceQuestionType | TextQuestionType
}

export default function QuestionCreator({ slug } : QuestionCreatorProps) {

    const contentItems: Map<QuestionIdType, JSX.Element> = new Map([
        [QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE, <SingleChoice />],
        [QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE, <MultipleChoice />],
        [QUESTION_TYPE_ID_MAP.WRITTEN_ANSWER_TYPE, <WrittenQuestion />],
    ])

    return (
        <div style={{flexShrink: 0}} className="w-4/5 md:w-[30%] h-4/5 mb-6 rounded-lg shadow-xl border-2 border-primary">
            {
                contentItems.get(slug.type)
            }
        </div>
    )
}
