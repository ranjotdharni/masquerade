import type { QUESTION_TYPE_ID_MAP } from "../constants"

export type QuestionIdType = typeof QUESTION_TYPE_ID_MAP[keyof typeof QUESTION_TYPE_ID_MAP]

export type ChoiceAnswerType = {
    id: string
    answer: string
}

export type ChoiceQuestionType = {
    id: string
    type: typeof QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE | typeof QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE
    question: string
    answers: ChoiceAnswerType[]
}

export type TextQuestionType = {
    id: string
    type: typeof QUESTION_TYPE_ID_MAP.WRITTEN_ANSWER_TYPE
    question: string
}
