import { Check, CircleDot, HandCoins, Star, type LucideIcon } from "lucide-react"
import type { Question, Survey } from "../../lib/types/api"
import type { QuestionIdType } from "../../lib/types/client"
import { QUESTION_TYPE_ID_MAP } from "../../lib/constants"

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
    
    function SingleChoicePane() {
        return (
            <ol className="w-full h-full flex flex-col justify-evenly">
                {
                    (answers as Array<{answer: string}>).map((answer, index) => {
                        return <li key={`QAPK__0${index}`} className="w-full px-2 h-12 flex flex-row items-center font-jbm text-text text-lg">{answer.answer}</li>
                    })
                }
            </ol>
        )
    }

    return (
        <form className="w-full h-full">
            { Array.isArray(answers) && <SingleChoicePane /> }
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
