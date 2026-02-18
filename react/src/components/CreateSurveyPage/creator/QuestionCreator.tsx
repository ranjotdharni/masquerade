import type { ChoiceQuestionType, QuestionIdType, RatingQuestionType } from "../../../lib/types/client"
import { MAX_ANSWERS_PER_QUESTION, QUESTION_TYPE_ID_MAP } from "../../../lib/constants"
import { Check, Plus, X } from "lucide-react"
import ToggleButton from "../../utility/animated/ToggleButton"
import { useState, type ChangeEvent, type MouseEvent } from "react"

type QuestionCreatorProps = {
    slug: ChoiceQuestionType | RatingQuestionType
    changeType: (current: ChoiceQuestionType | RatingQuestionType) => void
    editQuestion: (id: string, question: string) => void
    removeQuestion: (id: string) => void
    addAnswer: (questionId: string, answer: string) => void
    removeAnswer: (questionId: string, answerId: string) => void
    setOptional: (questionId: string, isOptional: boolean) => void
}

const contentItemNames: Map<QuestionIdType, string> = new Map([
    [QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE, "Multiple Choice"],
    [QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE, "Check List"],
    [QUESTION_TYPE_ID_MAP.RANKING_TYPE, "Ranking"],
    [QUESTION_TYPE_ID_MAP.RATING_TYPE, "Rating"],
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
            <button onClick={onCancel} className="w-[7.5%] py-1 flex flex-row justify-center items-center rounded text-secondary dark:text-inactive bg-error hover:cursor-pointer hover:text-background">
                <X />
            </button>
            <button onClick={add} className="w-[7.5%] py-1 flex flex-row justify-center items-center rounded text-text dark:text-accent bg-primary dark:bg-inactive hover:cursor-pointer hover:text-background dark:hover:text-secondary">
                <Check />
            </button>
        </li>
    )
}

export default function QuestionCreator({ slug, changeType, removeQuestion, addAnswer, removeAnswer, setOptional, editQuestion } : QuestionCreatorProps) {
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

    function modifyQuestion(event: ChangeEvent<HTMLTextAreaElement>) {
        editQuestion(slug.id, event.target.value)
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
        <div style={{flexShrink: 0}} className="z-10 w-4/5 md:w-[30%] h-[90%] mb-6 rounded-lg shadow-xl border-2 border-primary dark:border-inactive bg-background dark:bg-primary flex flex-col items-center">
            <header className="w-full h-[10%] px-4 space-x-4 bg-primary dark:bg-inactive flex flex-row justify-end items-center">
                <span className="flex-1 font-jbm text-text dark:text-primary">
                    <p>{contentItemNames.get(slug.type)}</p>
                </span>
                <button onClick={editType} className="font-lato-bold p-2 rounded text-sm text-background dark:text-accent bg-secondary dark:bg-primary hover:cursor-pointer hover:bg-text dark:hover:bg-primary dark:hover:text-secondary">Change Type</button>
                <button onClick={() => { removeQuestion(slug.id) }} className="hover:cursor-pointer text-secondary dark:text-primary hover:text-error">
                    <X />
                </button>
            </header>

            <section className="w-[98%] h-[20%] p-2 border-b border-primary dark:border-background flex flex-col items-center">
                <span className="w-[98%] h-1/3 font-jbm-bold text-text flex text-lg">Question</span>
                <textarea onChange={modifyQuestion} placeholder="Enter Question..." className="w-[98%] h-2/3 bg-accent dark:bg-inactive rounded resize-none outline-none p-1 font-jbm text-inactive dark:text-primary focus:text-text dark:focus:text-secondary"></textarea>
            </section>

            <ol className="p-2 pt-8 w-full flex-1 flex flex-col justify-start items-start space-y-4">
                {
                    slug.type === QUESTION_TYPE_ID_MAP.RATING_TYPE ?
                    <span className="w-full h-full flex flex-col justify-center items-center text-center font-jbm text-inactive">Rating will be given by survey participants.</span> :
                    slug.answers.map((answer) => {
                        return (
                            <li key={answer.id} className="w-full p-2 flex flex-row justify-between items-center space-x-2 border border-primary">
                                <div className="flex flex-row items-center">
                                    <BulletPoint width="10px" checklist={slug.type === QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE} />
                                    <p className="font-jbm text-text text-sm ml-2">{answer.answer}</p>
                                </div>
                                <button onClick={() => { removeAnswer(slug.id, answer.id) }} className="h-[20px] aspect-square flex flex-row justify-center items-center text-secondary dark:text-inactive hover:cursor-pointer hover:text-error">
                                    <X className="w-full h-full" />
                                </button>
                            </li>
                        )
                    })
                }

                { adding ? <AnswerCreator onAdd={add} onCancel={() => {setAdding(false)}} /> : <></> }
            </ol>

            <footer className="w-full h-[10%] px-4 space-x-4 bg-primary dark:bg-inactive flex flex-row justify-end items-center">
                <div className="flex flex-row items-center space-x-2 dark:bg-primary dark:p-2 dark:rounded">
                    <p className="text-xs font-jbm text-text">Optional</p>
                    <ToggleButton className="w-12" onActivated={() => {setOptional(slug.id, true)}} onDeactivated={() => {setOptional(slug.id, false)}} />
                </div>

                <button onClick={displayAnswerCreator} className="py-1 md:p-2 rounded flex flex-row space-x-1 !px-2 font-lato text-background bg-secondary hover:cursor-pointer hover:bg-text dark:text-accent dark:bg-primary dark:hover:bg-primary dark:hover:text-secondary">
                    <Plus />
                    <p>Add Answer</p>
                </button>
            </footer>
        </div>
    )
}
