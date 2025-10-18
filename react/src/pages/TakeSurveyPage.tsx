import { useParams } from "react-router-dom"
import AppContent from "../components/layout/AppContent"
import { useContext, useEffect, useState } from "react"
import { authenticatedRequest } from "../lib/utility/internal"
import { API_SURVEY_RETRIEVE, QUESTION_TYPE_ID_MAP } from "../lib/constants"
import FullScreenLoader from "../components/utility/FullScreenLoader"
import { UIContext } from "../components/context/UIContext"
import { generateClientId } from "../lib/utility/client"
import type { ObjectId, Survey } from "../lib/types/api"
import SurveyContent from "../components/TakeSurveyPage/SurveyContent"
import SurveyHeader from "../components/TakeSurveyPage/SurveyHeader"
import type { MultipleAnswerSlug, RankingAnswerSlug, RatingAnswerSlug, SingleAnswerSlug } from "../lib/types/client"

function SurveyContainer({ content } : { content: Survey }) {
    const [index, setIndex] = useState<number>(0)
    const [survey, setSurvey] = useState<((SingleAnswerSlug | MultipleAnswerSlug | RankingAnswerSlug | RatingAnswerSlug)[])>(content.questions.map(q => {
        // Ranking and Rating type require placeholder values

        if (q.type === QUESTION_TYPE_ID_MAP.RANKING_TYPE) {
            const slug = q.answers.map((a, i) => { return { _id: a._id, rank: i + 1 } })
            return {...q, slug: slug}
        }

        if (q.type === QUESTION_TYPE_ID_MAP.RATING_TYPE) {
            return {...q, slug: 0}
        }

        return q
    }))

    function cycleForward() {
        setIndex(prev => {
            return (prev + 1 > content.questions.length - 1 ? 0 : prev + 1)
        })
    }

    function cycleBackward() {
        setIndex(prev => {
            return (prev - 1 < 0 ? content.questions.length - 1 : prev - 1)
        })
    }

    function editAnswer(slug: string | [string, string] | number) {
        switch (survey[index].type) {
            case QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE:
                const newSurvey1 = [...survey]
                newSurvey1[index].slug = slug as string
                setSurvey(newSurvey1)
                break;
            case QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE:
                const newSurvey2 = [...survey]
                if (newSurvey2[index].slug){
                    const spliceIndex: number = (newSurvey2[index].slug as string[]).findIndex(a => a === slug)

                    if (spliceIndex === -1) 
                        newSurvey2[index].slug = [...newSurvey2[index].slug as string[], slug as string]
                    else 
                        (newSurvey2[index].slug as string[]).splice(spliceIndex, 1)
                }
                else {
                    newSurvey2[index].slug = [slug as string]
                }
                setSurvey(newSurvey2)
                break;
            case QUESTION_TYPE_ID_MAP.RANKING_TYPE:
                const newSurvey3 = [...survey]

                let first = (newSurvey3[index].answers as { _id: ObjectId, rank: number }[]).findIndex(a => a._id.$oid === (slug as [string, string])[0])
                let second = (newSurvey3[index].answers as { _id: ObjectId, rank: number }[]).findIndex(a => a._id.$oid === (slug as [string, string])[1])

                let firstRank: number = (newSurvey3[index].slug as Array<{ _id: ObjectId, rank: number }>)[first].rank as number

                (newSurvey3[index].slug as { _id: ObjectId, rank: number }[])[first].rank = (newSurvey3[index].slug as Array<{ _id: ObjectId, rank: number }>)[second].rank as number
                (newSurvey3[index].slug as { _id: ObjectId, rank: number }[])[second].rank = firstRank

                setSurvey(newSurvey3)
                break;
            default:
                const newSurvey4 = [...survey]
                newSurvey4[index].slug = slug as number
                setSurvey(newSurvey4)
        }
    }

    return (
        <section className="w-full md:w-[92vw] h-full relative left-[4vw] p-2">
            <SurveyHeader name={content.name} index={index} length={content.questions.length} cycleForward={cycleForward} cycleBackward={cycleBackward} />
            <SurveyContent survey={survey} index={index} editAnswer={editAnswer} />
        </section>
    )
}

export default function TakeSurveyPage() {
    const { id } = useParams()
    const { notify } = useContext(UIContext)

    const [content, setContent] = useState<Survey>()

    function notFoundPage() {
        window.location.href = `/${generateClientId()}`
    }

    useEffect(() => {
        async function getSurvey() {
            await authenticatedRequest(API_SURVEY_RETRIEVE, "POST", { id: id as string }).then(result => {
                if (result.error) {
                    // possible invite permission failure
                    notify({
                        message: result.message as string | undefined || "500 Internal Server Error",
                        color: "var(--color-error)"
                    })
                }

                if ((result as any)["empty"]) {
                    notFoundPage()
                }

                if ((result as any)["success"]) {
                    // handle returned survey content
                    let results: Survey[] = (result as any)["content"] as Survey[]
                    setContent(results[0])
                }
            })
        }

        getSurvey()
    }, [])

    return (
        <AppContent>
            {
                content ? 
                <SurveyContainer content={content} /> :
                <FullScreenLoader />
            }
        </AppContent>
    )
}