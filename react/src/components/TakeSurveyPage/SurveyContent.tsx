import { Check, CircleDot, HandCoins, Star, type LucideIcon } from "lucide-react"
import type { Question, Survey } from "../../lib/types/api"
import type { QuestionIdType } from "../../lib/types/client"
import { QUESTION_TYPE_ID_MAP } from "../../lib/constants"
import { useState, type JSX, type MouseEvent } from "react"

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

function AnswerPane({ type, answers } : { type: QuestionIdType, answers: { answer: string }[] | {} }) {

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
                    (answers as Array<{answer: string}>).map((answer, index) => {
                        return (
                            <li key={`QAPK__0${index}`} className="w-full px-2 h-12 flex flex-row items-center font-jbm text-text text-lg space-x-2">
                                <input type="radio" value={answer.answer} />
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
                    (answers as Array<{answer: string}>).map((answer, index) => {
                        return (
                            <li key={`QAPK__0${index}`} className="w-full px-2 h-12 flex flex-row items-center font-jbm text-text text-lg space-x-2">
                                <input type="checkbox" value={answer.answer} />
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

        const [ranking, setRanking] = useState<{id: string, answer: string, rank: 1 | 2 | 3 | 4}[]>(
            (answers as Array<{_id: {$oid: string}, answer: string}>).map((a, i) => { return {id: a._id.$oid, answer: a.answer, rank: i + 1 as 1 | 2 | 3 | 4} })
        )

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
                let newRanking = [...ranking]
                let firstIndex = newRanking.findIndex(r => r.id === highlight)
                let secondIndex = newRanking.findIndex(r => r.id === id)

                let firstBuffer: 1 | 2 | 3 | 4 = (0 + newRanking[firstIndex].rank) as 1 | 2 | 3 | 4

                newRanking[firstIndex].rank = newRanking[secondIndex].rank
                newRanking[secondIndex].rank = firstBuffer

                setRanking(newRanking)
                setHighlight(undefined)
            }
        }

        return (
            <ol className="w-full h-full flex flex-col justify-evenly">
                {
                    ranking.map(answer => {
                        return (
                            <li key={answer.id} className="w-full px-2 h-12 flex flex-row items-center font-jbm text-text text-lg space-x-2">
                                <button onClick={swap(answer.id)} style={highlight === answer.id ? {background: "var(--color-primary)", color: "var(--color-text)"} : {}} className="h-full px-2 text-primary border-4 border-primary hover:bg-primary hover:text-background hover:cursor-pointer">{answer.rank}</button>
                                <p>{answer.answer}</p>
                            </li>
                        )
                    })
                }
            </ol>
        )
    }

    function RatingPane() {
        const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(1)

        function modifyRating(r: 1 | 2 | 3 | 4 | 5): (event: MouseEvent<HTMLButtonElement>) => void {
            return (event: MouseEvent<HTMLButtonElement>) => {
                event.preventDefault()
                setRating(r)
            }
        }

        return (
            <ol className="w-full h-full flex flex-row justify-evenly items-center">
                {
                    [0,0,0,0,0].map((arg, index) => {
                        return (
                            <li key={`RPA_0${index}`} className="w-16 h-full flex flex-col justify-center items-center font-jbm text-text text-lg">
                                <button onClick={modifyRating(index + 1 as 1 | 2 | 3 | 4 | 5)} className="w-full aspect-square hover:cursor-pointer">
                                    <Star className="w-full h-full" style={{color: rating < index + 1 ? "var(--color-text)" : "var(--color-primary)", fill: rating < index + 1 ? undefined : "var(--color-primary)"}} />
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

function SurveyQuestion({ question } : { question: Question }) {
    let QuestionClassification: QuestionClassification = SURVEY_TYPE_TO_ICON[question.type]

    return (
        <div style={{flexShrink: 0}} className="w-4/5 md:w-1/3 h-[80vh] md:h-4/5 mb-6 rounded-lg shadow-xl border-2 border-primary flex flex-col items-center">
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
                <p className="font-jbm-bold text-lg text-text px-2 bg-accent rounded">
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

export default function SurveyContent({ content, index } : { content: Survey, index: number }) {

    return (
        <section className="w-full h-[88.5vh] top-[2.5vh] flex flex-col justify-center items-center">
            <SurveyQuestion key={content.questions[index]._id.$oid} question={content.questions[index]} />
        </section>
    )
}
