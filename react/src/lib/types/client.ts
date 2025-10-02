import type { QUESTION_TYPE_ID_MAP } from "../constants"
import type { MultipleChoiceQuestion, ObjectId, RankingQuestion, RatingQuestion, SingleChoiceQuestion } from "./api"

export type QuestionIdType = typeof QUESTION_TYPE_ID_MAP[keyof typeof QUESTION_TYPE_ID_MAP]

export type ChoiceAnswerType = {
    id: string
    answer: string
}

type QuestionType = {
    id: string
    optional: boolean
    question: string
}

export type ChoiceQuestionType = QuestionType & {
    type: typeof QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE | typeof QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE | typeof QUESTION_TYPE_ID_MAP.RANKING_TYPE
    answers: ChoiceAnswerType[]
}

export type RatingQuestionType = QuestionType & {
    type: typeof QUESTION_TYPE_ID_MAP.RATING_TYPE
}

export type SurveyCreationSlug = {
    name: string
    inviteOnly: boolean
    questions: (ChoiceQuestionType | RatingQuestionType)[]
}

export type SingleAnswerSlug = SingleChoiceQuestion & {
    slug?: string
}

export type MultipleAnswerSlug = MultipleChoiceQuestion & {
    slug?: string[]
}

export type RankingAnswerSlug = RankingQuestion & {
    slug: {
        _id: ObjectId
        rank: number
    }[]
}

export type RatingAnswerSlug = RatingQuestion & {
    slug: number
}
