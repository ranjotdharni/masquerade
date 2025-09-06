import { useState } from "react"
import CreateSurveyHeader from "../components/CreateSurveyPage/CreateSurveyHeader"
import AppContent from "../components/layout/AppContent"
import type { ChoiceQuestionType, QuestionIdType, TextQuestionType } from "../lib/types/client"
import { MAX_ANSWERS_PER_QUESTION, QUESTION_TYPE_ID_MAP } from "../lib/constants"
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

    function changeType(current: ChoiceQuestionType | TextQuestionType) {
        setQuestions(oldQuestions => {
            let newQuestions = [...oldQuestions]
            let changeIndex = newQuestions.findIndex(q => q.id === current.id)

            if (changeIndex !== -1)
                newQuestions[changeIndex] = {
                    ...newQuestionByType(cycleQuestionType(current.type)),
                    id: current.id,
                    question: current.question,
                }

            return newQuestions
        })
    }

    function addAnswer(questionId: string, answer: string) {
        setQuestions(oldQuestions => {
            let newQuestions = [...oldQuestions]
            let addIndex = newQuestions.findIndex(q => q.id === questionId)

            if (addIndex !== -1 && (newQuestions[addIndex] as ChoiceQuestionType).answers) {
                let question: ChoiceQuestionType = newQuestions[addIndex] as ChoiceQuestionType
                let newAnswers = [...question.answers]

                if (newAnswers.length === MAX_ANSWERS_PER_QUESTION)
                    return newQuestions

                newAnswers.push({
                    id: generateClientId(),
                    answer: answer,
                })

                question.answers = newAnswers
                newQuestions[addIndex] = question
            }

            return newQuestions
        })
    }

    return (
        <AppContent>
            <CreateSurveyHeader name={name} changeName={changeName} addQuestion={addQuestion} />
            
            <div className="w-full relative h-[88.5vh] md:h-[88.5vh] top-[2.5vh] py-6 flex flex-col items-center overflow-y-scroll border-t border-b border-primary">
                {
                    questions.map(item => {
                        return <QuestionCreator key={item.id} slug={item} changeType={changeType} removeQuestion={removeQuestion} addAnswer={addAnswer} />
                    })
                }
            </div>
        </AppContent>
    )
}
