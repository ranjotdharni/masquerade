import type { QUESTION_TYPE_ID_MAP } from "../constants"

export type QuestionIdType = typeof QUESTION_TYPE_ID_MAP[keyof typeof QUESTION_TYPE_ID_MAP]

export type ChoiceAnswerType = {
    id: string
    answer: string
}

type QuestionType = {
    id: string
    question: string
}

export type ChoiceQuestionType = QuestionType & {
    type: typeof QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE | typeof QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE
    answers: ChoiceAnswerType[]
}

export type TextQuestionType = QuestionType & {
    type: typeof QUESTION_TYPE_ID_MAP.WRITTEN_ANSWER_TYPE
}
