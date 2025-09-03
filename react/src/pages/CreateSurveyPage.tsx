import { useState } from "react"
import CreateSurveyHeader from "../components/CreateSurveyPage/CreateSurveyHeader"
import AppContent from "../components/layout/AppContent"
import type { ChoiceQuestionType, QuestionIdType, TextQuestionType } from "../lib/types/client"
import { QUESTION_TYPE_ID_MAP } from "../lib/constants"
import QuestionCreator from "../components/CreateSurveyPage/creator/QuestionCreator"
import { cycleQuestionType, generateClientId } from "../lib/utility/client"

function newSingleChoiceQuestion(): ChoiceQuestionType {
    return {
        id: generateClientId(),
        type: QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE,
        question: "",
        answers: [],
    }
}

function newMultipleChoiceQuestion(): ChoiceQuestionType {
    return {
        id: generateClientId(),
        type: QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE,
        question: "",
        answers: [],
    }
}

function newWrittenResponseQuestion(): TextQuestionType {
    return {
        id: generateClientId(),
        type: QUESTION_TYPE_ID_MAP.WRITTEN_ANSWER_TYPE,
        question: "",
    }
}

function newQuestionByType(type: QuestionIdType): ChoiceQuestionType | TextQuestionType {
    if (type === QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE)
        return newSingleChoiceQuestion()
    else if (type === QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE)
        return newMultipleChoiceQuestion()
    else 
        return newWrittenResponseQuestion()
}

export default function CreateSurveyPage() {
    const [name, setName] = useState<string>("")
    const [questions, setQuestions] = useState<(ChoiceQuestionType | TextQuestionType)[]>([])

    function changeName(name: string) {
        setName(name)
    }

    function addQuestion() {
        setQuestions(oldQuestions => {
            let newQuestions = [...oldQuestions]
            newQuestions.push(newSingleChoiceQuestion())
            return newQuestions
        })
    }

    function removeQuestion(id: string) {
        setQuestions(oldQuestions => {
            let newQuestions = [...oldQuestions]

            let removeIndex: number = newQuestions.findIndex(q => q.id === id)

            if (removeIndex !== -1) {
                newQuestions.splice(removeIndex, 1)
            }

            return newQuestions
        })
    }

    function changeType(id: string, currentType: QuestionIdType) {
        setQuestions(oldQuestions => {
            let newQuestions = [...oldQuestions]
            let changeIndex = newQuestions.findIndex(q => q.id === id)

            if (changeIndex !== -1)
                newQuestions[changeIndex] = newQuestionByType(cycleQuestionType(currentType))

            return newQuestions
        })
    }

    return (
        <AppContent>
            <CreateSurveyHeader name={name} changeName={changeName} addQuestion={addQuestion} />
            
            <div className="w-full h-[90%] md:h-[95%] py-6 flex flex-col items-center overflow-y-scroll border-t border-b border-primary">
                {
                    questions.map(item => {
                        return <QuestionCreator key={item.id} slug={item} changeType={changeType} removeQuestion={removeQuestion} />
                    })
                }
            </div>
        </AppContent>
    )
}
