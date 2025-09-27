import type { QuestionIdType } from "./client"
import type { QUESTION_TYPE_ID_MAP } from "../constants"

type ObjectId = {
    $oid: string
}

interface BaseQuestion {
    _id: ObjectId
    type: QuestionIdType
    optional: number
    question: string
}

interface SingleChoiceQuestion extends BaseQuestion {
    type: typeof QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE
    answers: { answer: string, _id: ObjectId }[]
}


interface MultipleChoiceQuestion extends BaseQuestion {
  type: typeof QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE
  answers: { answer: string, _id: ObjectId }[]
}


interface RankingQuestion extends BaseQuestion {
  type: typeof QUESTION_TYPE_ID_MAP.RANKING_TYPE
  answers: { answer: string, _id: ObjectId }[]
}


interface RatingQuestion extends BaseQuestion {
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
