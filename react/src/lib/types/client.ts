import type { LucideIcon } from "lucide-react"
import type { DUAL_IMAGE_UNIFORM_ARTICLE_ID, QUESTION_TYPE_ID_MAP, SINGLE_IMAGE_UNIFORM_ARTICLE_ID } from "../constants"
import type { MultipleChoiceQuestion, ObjectId, RankingQuestion, RatingQuestion, SingleChoiceQuestion } from "./api"

export type QuestionIdType = typeof QUESTION_TYPE_ID_MAP[keyof typeof QUESTION_TYPE_ID_MAP]
export type UniformArticleIDType = typeof SINGLE_IMAGE_UNIFORM_ARTICLE_ID | typeof DUAL_IMAGE_UNIFORM_ARTICLE_ID

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

export type QuestionClassification = {
    title: string
    Icon: LucideIcon
}

export type SingleImageUniformArticleType = {
    type: typeof SINGLE_IMAGE_UNIFORM_ARTICLE_ID
    src: string
    text: string
}

export type DualImageUniformArticleType = {
    type: typeof DUAL_IMAGE_UNIFORM_ARTICLE_ID
    src: readonly [string, string]
    text: string
}

export type UniformArticleType =
    | SingleImageUniformArticleType
    | DualImageUniformArticleType

export type UniformSectionType = {
    title: string
    content: UniformArticleType[]
}
