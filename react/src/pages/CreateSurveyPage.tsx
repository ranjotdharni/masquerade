import { useState } from "react"
import CreateSurveyHeader from "../components/CreateSurveyPage/CreateSurveyHeader"
import AppContent from "../components/layout/AppContent"
import type { ChoiceQuestionType, TextQuestionType } from "../lib/types/client"
import { QUESTION_TYPE_ID_MAP } from "../lib/constants"
import QuestionCreator from "../components/creator/QuestionCreator"
import { generateClientId } from "../lib/utility/client"

export default function CreateSurveyPage() {
    const [name, setName] = useState<string>("")
    const [questions, setQuestions] = useState<(ChoiceQuestionType | TextQuestionType)[]>([])

    function changeName(name: string) {
        setName(name)
    }

    function addQuestion() {
        setQuestions(oldQuestions => {
            let newQuestions = [...oldQuestions]
            newQuestions.push({
                id: generateClientId(),
                type: QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE,
                question: "",
                answers: [],
            } as ChoiceQuestionType)
            return newQuestions
        })
    }

    return (
        <AppContent>
            <CreateSurveyHeader name={name} changeName={changeName} addQuestion={addQuestion} />
            
            <div className="w-full h-[90%] md:h-[95%] py-6 flex flex-col items-center overflow-y-scroll border-t border-b border-primary">
                {
                    questions.map(item => {
                        return <QuestionCreator key={item.id} slug={item} />
                    })
                }
            </div>
        </AppContent>
    )
}
