import type { ChoiceQuestionType, QuestionIdType, TextQuestionType } from "../../../lib/types/client"
import { MAX_ANSWERS_PER_QUESTION, QUESTION_TYPE_ID_MAP } from "../../../lib/constants"
import { Check, Plus, X } from "lucide-react"
import ToggleButton from "../../utility/animated/ToggleButton"
import { useState, type MouseEvent } from "react"

type QuestionCreatorProps = {
    slug: ChoiceQuestionType | TextQuestionType
    changeType: (current: ChoiceQuestionType | TextQuestionType) => void
    removeQuestion: (id: string) => void
    addAnswer: (questionId: string, answer: string) => void
}

const contentItemNames: Map<QuestionIdType, string> = new Map([
    [QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE, "Multiple Choice"],
    [QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE, "Check List"],
    [QUESTION_TYPE_ID_MAP.WRITTEN_ANSWER_TYPE, "Text Response"],
])

function BulletPoint({ width, height, checklist } : { width?: string, height?: string, checklist?: boolean }) {
    return (
        <div style={{aspectRatio: 1, width: width || height, height: width || height}} className={`${checklist ? "" : "rounded-[1000px]"} border-2 border-inactive`}></div>
    )
}

function AnswerCreator({ onAdd, onCancel } : { onAdd: (answer: string) => void, onCancel: () => void }) {
    const [value, setValue] = useState<string>("")

    function add(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        if (value.trim().length === 0) 
            return

        onAdd(value.trim())
    }

    return (
        <li key="ANSWER_CREATOR_PSEUDO_KEY" className="w-full p-2 flex flex-row justify-evenly items-center">
            <input value={value} onChange={e => {setValue(e.target.value)}} placeholder="Enter Answer..." className="h-8 w-4/5 px-1 outline-none border-b border-inactive text-inactive font-jbm focus:border-text focus:text-text" />
            <button onClick={onCancel} className="w-[7.5%] py-1 flex flex-row justify-center items-center rounded text-secondary bg-error hover:cursor-pointer hover:text-background">
                <X />
            </button>
            <button onClick={add} className="w-[7.5%] py-1 flex flex-row justify-center items-center rounded text-text bg-primary hover:cursor-pointer hover:text-background">
                <Check />
            </button>
        </li>
    )
}

export default function QuestionCreator({ slug, changeType, removeQuestion, addAnswer } : QuestionCreatorProps) {
    const [adding, setAdding] = useState<boolean>(false)

    function displayAnswerCreator(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        if (!(slug as ChoiceQuestionType).answers || (slug as ChoiceQuestionType).answers.length === MAX_ANSWERS_PER_QUESTION)
            return

        setAdding(prev => {
            if (!prev)
                return true

            return prev
        })
    }

    function editType() {
        setAdding(prev => {
            if (prev)
                return false

            return prev
        })

        changeType(slug)
    }

    function add(answer: string) {
        addAnswer(slug.id, answer)
        setAdding(false)
    }

    return (
        <div style={{flexShrink: 0}} className="w-4/5 md:w-[30%] h-4/5 mb-6 rounded-lg shadow-xl border-2 border-primary flex flex-col items-center">
            <header className="w-full h-[10%] px-4 space-x-4 bg-primary flex flex-row justify-end items-center">
                <span className="flex-1 font-jbm text-text">
                    <p>{contentItemNames.get(slug.type)}</p>
                </span>
                <button onClick={editType} className="font-lato-bold p-2 rounded text-sm text-background bg-secondary hover:cursor-pointer hover:bg-text">Change Type</button>
                <button onClick={() => { removeQuestion(slug.id) }} className="hover:cursor-pointer text-secondary hover:text-error">
                    <X />
                </button>
            </header>

            <section className="w-[98%] h-[20%] p-2 border-b border-primary flex flex-col items-center">
                <span className="w-[98%] h-1/3 font-jbm-bold text-text flex text-lg">Question</span>
                <textarea placeholder="Enter Question..." className="w-[98%] h-2/3 bg-accent rounded resize-none outline-none p-1 font-jbm text-inactive focus:text-text"></textarea>
            </section>

            <ol className="p-2 pt-8 w-full flex-1 flex flex-col justify-start items-start space-y-2">
                {
                    slug.type === QUESTION_TYPE_ID_MAP.WRITTEN_ANSWER_TYPE ?
                    <span className="w-full h-full flex flex-col justify-center items-center text-center font-jbm text-inactive">Answers will be written by survey participants.</span> :
                    slug.answers.map((answer) => {
                        return (
                            <li key={answer.id} className="p-2 flex flex-row items-center space-x-2">
                                <BulletPoint width="10px" checklist={slug.type === QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE} />
                                <p className="font-jbm text-text text-sm">{answer.answer}</p>
                            </li>
                        )
                    })
                }

                { adding ? <AnswerCreator onAdd={add} onCancel={() => {setAdding(false)}} /> : <></> }
            </ol>

            <footer className="w-full h-[10%] px-4 space-x-4 bg-primary flex flex-row justify-end items-center">
                <div className="flex flex-row items-center space-x-2">
                    <p className="text-xs font-jbm text-text">Optional</p>
                    <ToggleButton className="w-12" />
                </div>

                <button onClick={displayAnswerCreator} className="py-1 md:p-2 rounded flex flex-row space-x-1 !px-2 font-lato text-background bg-secondary hover:cursor-pointer hover:bg-text">
                    <Plus />
                    <p>Add Answer</p>
                </button>
            </footer>
        </div>
    )
}
