import { Check, CircleDot, HandCoins, Star, type LucideIcon } from "lucide-react"
import type { QuestionIdType } from "../../../lib/types/client"
import { DEFAULT_ERROR_MESSAGE, QUESTION_TYPE_ID_MAP } from "../../../lib/constants"
import { type JSX } from "react"
import type { BaseAnswer, MultipleChoiceAnswer, Question, RankingAnswer, SingleChoiceAnswer } from "../../../lib/types/api"

type QuestionClassification = {
    title: string
    Icon: LucideIcon
}

const SURVEY_TYPE_TO_ICON: Record<QuestionIdType, QuestionClassification> = {
    [QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE]: {
        title: "Multiple Choice",
        Icon: CircleDot,
    },
    [QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE]:  {
        title: "Check List",
        Icon: Check,
    },
    [QUESTION_TYPE_ID_MAP.RANKING_TYPE]:  {
        title: "Ranking",
        Icon: HandCoins,
    },
    [QUESTION_TYPE_ID_MAP.RATING_TYPE]:  {
        title: "Rating",
        Icon: Star,
    },
}

function AnswerPane({ type, answers } : { type: QuestionIdType, answers: BaseAnswer }) {

    const TYPE_TO_ANSWER_PANE: Record<QuestionIdType, JSX.Element> = {
        [QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE]: <SingleChoicePane />,
        [QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE]:  <MultipleChoicePane />,
        [QUESTION_TYPE_ID_MAP.RANKING_TYPE]:  <RankingPane />,
        [QUESTION_TYPE_ID_MAP.RATING_TYPE]:  <RatingPane />,
    }

    function BulletPoint({ width, height, checklist } : { width?: string, height?: string, checklist?: boolean }) {
        return (
            <div style={{aspectRatio: 1, width: width || height, height: width || height}} className={`${checklist ? "" : "rounded-[1000px]"} border-1 border-inactive`}></div>
        )
    }
    
    function SingleChoicePane() {
        return (
            <ol className="w-full h-full flex flex-col justify-evenly">
                {
                    (answers as SingleChoiceAnswer[]).map((answer, index) => {
                        return (
                            <li key={`QAPK__0${index}`} className="w-full px-2 h-12 flex flex-row items-center font-jbm text-text md:text-lg space-x-2">
                                <BulletPoint width="7px" />
                                <p className="text-sm">{answer.answer}</p>
                            </li>
                        )
                    })
                }
            </ol>
        )
    }

    function MultipleChoicePane() {
        return (
            <ol className="w-full h-full flex flex-col justify-evenly">
                {
                    (answers as MultipleChoiceAnswer[]).map((answer, index) => {
                        return (
                            <li key={`QAPK__0${index}`} className="w-full px-2 h-12 flex flex-row items-center font-jbm text-text md:text-lg space-x-2">
                                <BulletPoint width="7px" checklist />
                                <p className="text-sm">{answer.answer}</p>
                            </li>
                        )
                    })
                }
            </ol>
        )
    }
    
    function RankingPane() {

        return (
            <ol className="w-full h-full flex flex-col justify-evenly">
                {
                    (answers as RankingAnswer[]).map((answer, index) => {
                        return (
                            <li key={answer._id.$oid} className="w-full px-2 h-10 flex flex-row items-center font-jbm text-text md:text-lg space-x-2">
                                <div className="h-full flex flex-col justify-center items-center px-2 text-secondary-light border-2 border-secondary-light">{index + 1}</div>
                                <p className="text-sm">{answer.answer}</p>
                            </li>
                        )
                    })
                }
            </ol>
        )
    }

    function RatingPane() {
        return (
            <div className="w-full h-full flex flex-row justify-evenly items-center">
                <span className="w-full h-full flex flex-col justify-center items-center text-center font-jbm text-inactive">Rating will be given by survey participants.</span>
            </div>
        )
    }

    return (
        <form className="w-full h-full">
            { TYPE_TO_ANSWER_PANE[type] }
        </form>
    )
}

function SurveyQuestion({ question } : { question: Question }) {
    let QuestionClassification: QuestionClassification = SURVEY_TYPE_TO_ICON[question.type]

    if (!question.answers) {
        return (
            <p>{DEFAULT_ERROR_MESSAGE}</p>
        )
    }

    return (
        <div style={{flexShrink: 0}} className="w-4/5 md:w-[30%] h-full rounded-lg shadow-xl border-2 border-primary flex flex-col items-center bg-background">
            <span className="w-full h-[8%] p-2 bg-primary flex flex-row justify-between items-center">
                <span className="h-full flex flex-row justify-center items-center font-jbm text-text space-x-2">
                    <QuestionClassification.Icon className="text-background" />
                    <p>{QuestionClassification.title}</p>
                </span>

                <p className="font-lato-italic text-inactive">
                    {question.optional ? "Optional" : "Required"}
                </p>
            </span>

            <span className="px-4 h-42 flex flex-col justify-center items-center text-left">
                <p className="font-jbm-bold text-text px-2 bg-accent rounded">
                    {question.question}
                </p>
            </span>

            <span className="w-[98%] border border-inactive opacity-[0.1]"></span>

            <section className="w-full flex-1 p-4">
                <AnswerPane type={question.type} answers={question.answers} />
            </section>
        </div>
    )
}

export default function QuestionViewer({ survey, index } : { survey: Question[], index: number }) {

    return (
        <section className="h-[90%] w-full flex flex-col justify-center items-center">
            <SurveyQuestion key={survey[index]._id.$oid} question={survey[index]} />
        </section>
    )
}
