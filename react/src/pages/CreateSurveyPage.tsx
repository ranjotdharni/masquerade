import { useContext, useState, type MouseEvent } from "react"
import CreateSurveyHeader from "../components/CreateSurveyPage/CreateSurveyHeader"
import AppContent from "../components/layout/AppContent"
import type { ChoiceQuestionType, QuestionIdType, RatingQuestionType, SurveyCreationSlug } from "../lib/types/client"
import { API_SURVEY_CREATE, MAX_ANSWERS_PER_QUESTION, MAX_QUESTIONS_PER_SURVEY, PAGE_HOME, QUESTION_TYPE_ID_MAP } from "../lib/constants"
import QuestionCreator from "../components/CreateSurveyPage/creator/QuestionCreator"
import { generateClientId } from "../lib/utility/client"
import type { GenericError, GenericSuccess } from "../lib/types/internal"
import { authenticatedRequest } from "../lib/utility/internal"
import { UIContext } from "../components/context/UIContext"
import { useNavigate } from "react-router-dom"

function newSingleChoiceQuestion(): ChoiceQuestionType {
    return {
        id: generateClientId(),
        type: QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE,
        optional: false,
        question: "",
        answers: [],
    }
}

function newMultipleChoiceQuestion(): ChoiceQuestionType {
    return {
        id: generateClientId(),
        type: QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE,
        optional: false,
        question: "",
        answers: [],
    }
}

function newRankingQuestion(): ChoiceQuestionType {
    return {
        id: generateClientId(),
        type: QUESTION_TYPE_ID_MAP.RANKING_TYPE,
        optional: false,
        question: "",
        answers: [],
    }
}

function newRatingQuestion(): RatingQuestionType {
    return {
        id: generateClientId(),
        type: QUESTION_TYPE_ID_MAP.RATING_TYPE,
        optional: false,
        question: "",
    }
}

function newQuestionByType(type: QuestionIdType): ChoiceQuestionType | RatingQuestionType {
    switch (type) {
        case QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE:
            return newSingleChoiceQuestion()
        case QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE:
            return newMultipleChoiceQuestion()
        case QUESTION_TYPE_ID_MAP.RANKING_TYPE:
            return newRankingQuestion()
        default:
            return newRatingQuestion()
    }
}

function cycleQuestionType(type: QuestionIdType): QuestionIdType {
    const values = Object.values(QUESTION_TYPE_ID_MAP)
    const typeIndex = values.indexOf(type)

    if (typeIndex === -1 || typeIndex + 1 >= values.length)
        return values[0]
    
    return values[typeIndex + 1]
}

async function createSurvey(slug: SurveyCreationSlug): Promise<GenericSuccess | GenericError> {
    return await authenticatedRequest(API_SURVEY_CREATE, "POST", slug).then(response => {
        if (response.error)
            return response as GenericError

        return { success: true } as GenericSuccess
    })
}

export default function CreateSurveyPage() {
    const navigation = useNavigate()
    const { notify, confirm } = useContext(UIContext)

    const [name, setName] = useState<string>("")
    const [inviteOnly, setInviteOnly] = useState<boolean>(false)
    const [questions, setQuestions] = useState<(ChoiceQuestionType | RatingQuestionType)[]>([])

    function changeName(name: string) {
        setName(name)
    }

    function editQuestion(id: string, question: string) {
        setQuestions(oldQuestions => {
            let newQuestions = [...oldQuestions]

            let editIndex: number = newQuestions.findIndex(q => q.id === id)

            if (editIndex !== -1) {
                newQuestions[editIndex].question = question
            }

            return newQuestions
        })
    }

    function addQuestion() {
        setQuestions(oldQuestions => {
            if (oldQuestions.length >= MAX_QUESTIONS_PER_SURVEY)
                return oldQuestions

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

    function changeType(current: ChoiceQuestionType | RatingQuestionType) {
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

    function removeAnswer(questionId: string, answerId: string) {
        setQuestions(oldQuestions => {
            let newQuestions = [...oldQuestions]
            let removeIndex = newQuestions.findIndex(q => q.id === questionId)

            if (removeIndex !== -1 && (newQuestions[removeIndex] as ChoiceQuestionType).answers) {
                let question: ChoiceQuestionType = newQuestions[removeIndex] as ChoiceQuestionType
                let newAnswers = question.answers.filter(a => a.id !== answerId)

                question.answers = newAnswers
                newQuestions[removeIndex] = question
            }

            return newQuestions
        })
    }

    function setAnswerOptional(questionId: string, isOptional: boolean) {
        setQuestions(oldQuestions => {
            let newQuestions = [...oldQuestions]
            let modifyIndex = newQuestions.findIndex(q => q.id === questionId)

            if (modifyIndex !== -1) {
                let question: ChoiceQuestionType = newQuestions[modifyIndex] as ChoiceQuestionType
                question.optional = isOptional
                newQuestions[modifyIndex] = question
            }

            return newQuestions
        })
    }

    async function submit(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        confirm({
            message: "Once you create a survey, you cannot modify it. Do you still want to continue?",
            loaderText: "Creating Survey...",
            callback: async () => {
                const slug = {
                    name: name.trim(),
                    inviteOnly: inviteOnly,
                    questions: questions
                }

                await authenticatedRequest(API_SURVEY_CREATE, "POST", slug).then(response => {
                    let message: string = response.message as string || "Survey Created"
                    let color: string = "var(--color-text)"

                    if ((response as GenericError).error) {
                        message = response.message as string || "500 Internal Server Error"
                        color = "var(--color-error)"
                    }
                    else {
                        navigation(`/${PAGE_HOME}`)
                    }

                    notify({
                        message: message,
                        color: color
                    })
                })
            }
        })
    }

    return (
        <AppContent>
            <CreateSurveyHeader name={name} changeName={changeName} addQuestion={addQuestion} setInviteOnly={setInviteOnly} submit={submit} />
            
            <div className="w-full relative h-[88.5vh] md:h-[88.5vh] top-[2.5vh] py-6 flex flex-col items-center overflow-y-scroll border-t border-b border-primary">
                {
                    questions.map(item => {
                        return <QuestionCreator key={item.id} slug={item} changeType={changeType} editQuestion={editQuestion} removeQuestion={removeQuestion} addAnswer={addAnswer} removeAnswer={removeAnswer} setOptional={setAnswerOptional} />
                    })
                }
            </div>
        </AppContent>
    )
}
