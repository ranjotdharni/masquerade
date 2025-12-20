import { Check, CircleDot, HandCoins, Star, type LucideIcon } from "lucide-react"
import type { MultipleAnswerSlug, QuestionIdType, RankingAnswerSlug, RatingAnswerSlug, SingleAnswerSlug } from "../../lib/types/client"
import { QUESTION_TYPE_ID_MAP } from "../../lib/constants"
import { useState, type JSX, type MouseEvent } from "react"

type QuestionClassification = {
    title: string
    Icon: LucideIcon
}

type EditAnswerFunction = (slug: string | [string, string] | number) => void

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

function AnswerPane({ type, answers, editAnswer } : { type: QuestionIdType, answers: SingleAnswerSlug | MultipleAnswerSlug | RankingAnswerSlug | RatingAnswerSlug, editAnswer: EditAnswerFunction }) {

    const TYPE_TO_ANSWER_PANE: Record<QuestionIdType, JSX.Element> = {
        [QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE]: <SingleChoicePane />,
        [QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE]:  <MultipleChoicePane />,
        [QUESTION_TYPE_ID_MAP.RANKING_TYPE]:  <RankingPane />,
        [QUESTION_TYPE_ID_MAP.RATING_TYPE]:  <RatingPane />,
    }
    
    function SingleChoicePane() {
        return (
            <ol className="w-full h-full flex flex-col justify-evenly">
                {
                    (answers as SingleAnswerSlug).answers.map((answer, index) => {
                        return (
                            <li key={`QAPK__0${index}`} className="w-full px-2 h-12 flex flex-row items-center font-jbm text-text md:text-lg space-x-2">
                                <input type="radio" checked={answers.slug !== undefined && answer._id.$oid === answers.slug} value={answer.answer} name={answer._id.$oid} onClick={(e) => {editAnswer(e.currentTarget.name)}} />
                                <p>{answer.answer}</p>
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
                    (answers as MultipleAnswerSlug).answers.map((answer, index) => {
                        return (
                            <li key={`QAPK__0${index}`} className="w-full px-2 h-12 flex flex-row items-center font-jbm text-text md:text-lg space-x-2">
                                <input type="checkbox" checked={(answers as MultipleAnswerSlug).slug !== undefined ? (answers as MultipleAnswerSlug).slug!.findIndex(a => a === answer._id.$oid) !== -1 : false} value={answer.answer}  name={answer._id.$oid} onClick={(e) => {editAnswer(e.currentTarget.name)}} />
                                <p>{answer.answer}</p>
                            </li>
                        )
                    })
                }
            </ol>
        )
    }
    
    function RankingPane() {
        const [highlight, setHighlight] = useState<string | undefined>()

        function swap(id: string): (event: MouseEvent<HTMLButtonElement>) => void {
            return (event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault()

                if (highlight === id) {
                    setHighlight(undefined)
                    return
                }

                if (!highlight) {
                    setHighlight(id)
                    return
                }

                // handle swap
                editAnswer([highlight, id])
            }
        }

        return (
            <ol className="w-full h-full flex flex-col justify-evenly">
                {
                    (answers as MultipleAnswerSlug).answers.map((answer, index) => {
                        return (
                            <li key={answer._id.$oid} className="w-full px-2 h-12 flex flex-row items-center font-jbm text-text md:text-lg space-x-2">
                                <button onClick={swap(answer._id.$oid)} style={highlight === answer._id.$oid ? {background: "var(--color-primary)", color: "var(--color-text)"} : {}} className="h-full px-2 text-primary border-4 border-primary hover:bg-primary hover:text-background hover:cursor-pointer">{(answers as RankingAnswerSlug).slug[index].rank}</button>
                                <p>{answer.answer}</p>
                            </li>
                        )
                    })
                }
            </ol>
        )
    }

    function RatingPane() {
        function modifyRating(r: 1 | 2 | 3 | 4 | 5): (event: MouseEvent<HTMLButtonElement>) => void {
            return (event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault()

                if ((answers as RatingAnswerSlug).slug === r)
                    editAnswer(0)
                else
                    editAnswer(r)
            }
        }

        return (
            <ol className="w-full h-full flex flex-row justify-evenly items-center">
                {
                    [0,0,0,0,0].map((_, index) => {
                        return (
                            <li key={`RPA_0${index}`} className="w-16 h-full flex flex-col justify-center items-center font-jbm text-text md:text-lg">
                                <button onClick={modifyRating(index + 1 as 1 | 2 | 3 | 4 | 5)} className="w-full aspect-square hover:cursor-pointer">
                                    <Star className="w-full h-full" style={{color: (answers as RatingAnswerSlug).slug < index + 1 ? "var(--color-text)" : "var(--color-primary)", fill: (answers as RatingAnswerSlug).slug < index + 1 ? undefined : "var(--color-primary)"}} />
                                </button>
                            </li>
                        )
                    })
                }
            </ol>
        )
    }

    return (
        <form className="w-full h-full">
            { TYPE_TO_ANSWER_PANE[type] }
        </form>
    )
}

function SurveyQuestion({ question, editAnswer } : { question: SingleAnswerSlug | MultipleAnswerSlug | RankingAnswerSlug | RatingAnswerSlug, editAnswer: EditAnswerFunction }) {
    let QuestionClassification: QuestionClassification = SURVEY_TYPE_TO_ICON[question.type]

    return (
        <div style={{flexShrink: 0}} className="w-4/5 md:w-1/3 h-[80vh] md:h-[90%] mb-6 rounded-lg shadow-xl border-2 border-primary flex flex-col items-center">
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
                <p className="font-jbm-bold md:text-lg text-text px-2 bg-accent rounded">
                    {question.question}
                </p>
            </span>

            <span className="w-[98%] border border-inactive opacity-[0.1]"></span>

            <section className="w-full flex-1 p-4">
                <AnswerPane type={question.type} answers={question} editAnswer={editAnswer} />
            </section>
        </div>
    )
}

export default function SurveyContent({ survey, index, editAnswer } : { survey: (SingleAnswerSlug | MultipleAnswerSlug | RankingAnswerSlug | RatingAnswerSlug)[], index: number, editAnswer: EditAnswerFunction }) {

    return (
        <section className="w-full h-[85vh] top-[2.5vh] flex flex-col justify-center items-center">
            <SurveyQuestion key={survey[index]._id.$oid} question={survey[index]} editAnswer={editAnswer} />
        </section>
    )
}
