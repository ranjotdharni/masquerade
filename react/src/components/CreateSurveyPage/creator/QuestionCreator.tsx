import { type JSX } from "react"
import type { ChoiceQuestionType, QuestionIdType, TextQuestionType } from "../../../lib/types/client"
import { QUESTION_TYPE_ID_MAP } from "../../../lib/constants"
import SingleChoice from "./SingleChoice"
import MultipleChoice from "./MultipleChoice"
import WrittenQuestion from "./WrittenQuestion"
import { X } from "lucide-react"

type QuestionCreatorProps = {
    slug: ChoiceQuestionType | TextQuestionType
    changeType: (id: string, currentType: QuestionIdType) => void
    removeQuestion: (id: string) => void
}

const contentItemNames: Map<QuestionIdType, string> = new Map([
    [QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE, "Single Answer"],
    [QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE, "Checklist"],
    [QUESTION_TYPE_ID_MAP.WRITTEN_ANSWER_TYPE, "Text Response"],
])

export default function QuestionCreator({ slug, changeType, removeQuestion } : QuestionCreatorProps) {

    const contentItems: Map<QuestionIdType, JSX.Element> = new Map([
        [QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE, <SingleChoice />],
        [QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE, <MultipleChoice />],
        [QUESTION_TYPE_ID_MAP.WRITTEN_ANSWER_TYPE, <WrittenQuestion />],
    ])

    return (
        <div style={{flexShrink: 0}} className="w-4/5 md:w-[30%] h-4/5 mb-6 rounded-lg shadow-xl border-2 border-primary">
            <header className="w-full h-[10%] px-4 space-x-4 bg-primary flex flex-row justify-end items-center">
                <span className="flex-1 font-jbm text-text">
                    <p>{contentItemNames.get(slug.type)}</p>
                </span>
                <button onClick={() => { changeType(slug.id, slug.type) }} className="font-lato p-2 rounded text-sm text-background bg-secondary hover:cursor-pointer hover:bg-text">Change Type</button>
                <button onClick={() => { removeQuestion(slug.id) }} className="hover:cursor-pointer text-secondary hover:text-error">
                    <X />
                </button>
            </header>
            {
                contentItems.get(slug.type)
            }
        </div>
    )
}
