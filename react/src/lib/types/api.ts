import type { QuestionIdType } from "./client"
import type { QUESTION_TYPE_ID_MAP } from "../constants"

export type ObjectId = {
    $oid: string
}

export type SingleChoiceAnswer = {
  _id: ObjectId
  answer: string
  submissions?: number
}

export type MultipleChoiceAnswer = {
  _id: ObjectId
  answer: string
  submissions?: number
}

export type RankingAnswer = {
  _id: ObjectId
  answer: string
  1?: number
  2?: number
  3?: number
  4?: number
}

export type RatingAnswer = {
  1?: number
  2?: number
  3?: number
  4?: number
  5?: number
}

export type BaseAnswer = 
  | SingleChoiceAnswer[]
  | MultipleChoiceAnswer[]
  | RankingAnswer[]
  | RatingAnswer

interface BaseQuestion {
  _id: ObjectId
  type: QuestionIdType
  optional: boolean
  submissions?: number
  question: string
  answers?: BaseAnswer
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: typeof QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE
  answers?: SingleChoiceAnswer[]
}


export interface MultipleChoiceQuestion extends BaseQuestion {
  type: typeof QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE
  answers?: MultipleChoiceAnswer[]
}


export interface RankingQuestion extends BaseQuestion {
  type: typeof QUESTION_TYPE_ID_MAP.RANKING_TYPE
  answers?: RankingAnswer[]
}


export interface RatingQuestion extends BaseQuestion {
  type: typeof QUESTION_TYPE_ID_MAP.RATING_TYPE
  answers?: RatingAnswer
}

export type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | RankingQuestion
  | RatingQuestion

export interface Survey {
  _id: ObjectId
  creator?: string
  name: string
  inviteOnly: boolean
  submissions?: number
  inviteList?: string[]
  questions: Question[]
}

export type SurveyMetadata = Omit<Survey, "questions"> & {
  numberOfQuestions: number
}
