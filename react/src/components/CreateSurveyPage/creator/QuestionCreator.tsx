import type { ChoiceQuestionType, QuestionIdType, TextQuestionType } from "../../../lib/types/client"
import { QUESTION_TYPE_ID_MAP } from "../../../lib/constants"
import { Plus, X } from "lucide-react"
import ToggleButton from "../../utility/animated/ToggleButton"

type QuestionCreatorProps = {
    slug: ChoiceQuestionType | TextQuestionType
    changeType: (current: ChoiceQuestionType | TextQuestionType) => void
    removeQuestion: (id: string) => void
}

const contentItemNames: Map<QuestionIdType, string> = new Map([
    [QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE, "Multiple Choice"],
    [QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE, "Check List"],
    [QUESTION_TYPE_ID_MAP.WRITTEN_ANSWER_TYPE, "Text Response"],
])

export default function QuestionCreator({ slug, changeType, removeQuestion } : QuestionCreatorProps) {

    return (
        <div style={{flexShrink: 0}} className="w-4/5 md:w-[30%] h-4/5 mb-6 rounded-lg shadow-xl border-2 border-primary flex flex-col items-center">
            <header className="w-full h-[10%] px-4 space-x-4 bg-primary flex flex-row justify-end items-center">
                <span className="flex-1 font-jbm text-text">
                    <p>{contentItemNames.get(slug.type)}</p>
                </span>
                <button onClick={() => { changeType(slug) }} className="font-lato-bold p-2 rounded text-sm text-background bg-secondary hover:cursor-pointer hover:bg-text">Change Type</button>
                <button onClick={() => { removeQuestion(slug.id) }} className="hover:cursor-pointer text-secondary hover:text-error">
                    <X />
                </button>
            </header>

            <section className="w-[98%] h-[20%] p-2 border-b border-primary flex flex-col items-center">
                <span className="w-[98%] h-1/3 font-jbm-bold text-text flex text-lg">Question</span>
                <textarea placeholder="Enter Question..." className="w-[98%] h-2/3 bg-accent rounded resize-none outline-none p-1 font-jbm text-inactive focus:text-text"></textarea>
            </section>

            <section className="flex-1">
                
            </section>

            <footer className="w-full h-[10%] px-4 space-x-4 bg-primary flex flex-row justify-end items-center">
                <div className="flex flex-row items-center space-x-2">
                    <p className="text-xs font-jbm text-text">Optional</p>
                    <ToggleButton className="w-12" />
                </div>

                <button className="py-1 md:p-2 rounded flex flex-row space-x-1 !px-2 font-lato text-background bg-secondary hover:cursor-pointer hover:bg-text">
                    <Plus />
                    <p>Add Answer</p>
                </button>
            </footer>
        </div>
    )
}
