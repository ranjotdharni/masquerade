import type { QuestionIdType } from "./client"
import type { QUESTION_TYPE_ID_MAP } from "../constants"

export type ObjectId = {
    $oid: string
}

interface BaseQuestion {
    _id: ObjectId
    type: QuestionIdType
    optional: number
    question: string
}

export interface SingleChoiceQuestion extends BaseQuestion {
    type: typeof QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE
    answers: { answer: string, _id: ObjectId }[]
}


export interface MultipleChoiceQuestion extends BaseQuestion {
  type: typeof QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE
  answers: { answer: string, _id: ObjectId }[]
}


export interface RankingQuestion extends BaseQuestion {
  type: typeof QUESTION_TYPE_ID_MAP.RANKING_TYPE
  answers: { answer: string, _id: ObjectId }[]
}


export interface RatingQuestion extends BaseQuestion {
  type: typeof QUESTION_TYPE_ID_MAP.RATING_TYPE
  answers: {
    answer?: number
  } | {}
}

export type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | RankingQuestion
  | RatingQuestion

export interface Survey {
    _id: ObjectId
    name: string
    inviteOnly: boolean
    questions: Question[]
}
