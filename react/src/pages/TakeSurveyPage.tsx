import { useNavigate, useParams } from "react-router-dom"
import AppContent from "../components/layout/AppContent"
import { useContext, useEffect, useState, type MouseEvent } from "react"
import { authenticatedRequest } from "../lib/utility/internal"
import { API_SURVEY_CATALOG, API_SURVEY_SUBMIT, DEFAULT_ERROR_MESSAGE, PAGE_SURVEY_SUBMITTED, QUESTION_TYPE_ID_MAP } from "../lib/constants"
import FullScreenLoader from "../components/utility/FullScreenLoader"
import { UIContext } from "../components/context/UIContext"
import { generateClientId } from "../lib/utility/client"
import type { ObjectId, Question, RankingAnswer, Survey } from "../lib/types/api"
import SurveyContent from "../components/TakeSurveyPage/SurveyContent"
import SurveyHeader from "../components/TakeSurveyPage/SurveyHeader"
import type { MultipleAnswerSlug, RankingAnswerSlug, RatingAnswerSlug, SingleAnswerSlug } from "../lib/types/client"
import type { GenericError } from "../lib/types/internal"
import { AuthContext } from "../components/context/AuthContext"

function SurveyContainer({ content } : { content: Survey }) {
    const authentication = useContext(AuthContext)
    const { confirm, notify } = useContext(UIContext)
    const navigation = useNavigate()

    const [index, setIndex] = useState<number>(0)
    const [remaining, setRemaining] = useState<number>(content.questions.filter(q => !q.optional && (q.type !== QUESTION_TYPE_ID_MAP.RANKING_TYPE)).length)
    const [survey, setSurvey] = useState<((SingleAnswerSlug | MultipleAnswerSlug | RankingAnswerSlug | RatingAnswerSlug)[])>(content.questions.map(q => {
        // Ranking and Rating type require placeholder values

        if (q.type === QUESTION_TYPE_ID_MAP.RANKING_TYPE) {
            const slug = q.answers?.map((a, i) => { return { _id: a._id, rank: i + 1 } })
            return {...q, slug: slug || [{ _id: { $oid: DEFAULT_ERROR_MESSAGE }, rank: 0 }]}
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

    function updateRemaining() {
        // always check required
        // single answer, check if slug is defined
        // multiple answer, check if slug exists and if it is not empty
        // ranking answer, check that slug is not 0
        // rating answer is always fine

        let remnants1 = content.questions.filter(q => !q.optional && (q.type !== QUESTION_TYPE_ID_MAP.RANKING_TYPE))
        let remnants2 = JSON.parse(JSON.stringify(remnants1)) as Question[]
        let remnants3 = survey.filter(q => !q.optional && (q.type !== QUESTION_TYPE_ID_MAP.RANKING_TYPE))
        remnants1 = remnants1.filter(q => q.type === QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE && !(q as SingleAnswerSlug).slug)
        remnants2 = remnants2.filter(q => q.type === QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE && (!(q as MultipleAnswerSlug).slug || (q as MultipleAnswerSlug).slug?.length === 0))
        remnants3 = remnants3.filter(q => q.type === QUESTION_TYPE_ID_MAP.RATING_TYPE && (!(q as RatingAnswerSlug).slug || (q as RatingAnswerSlug).slug < 1))

        setRemaining(remnants1.length + remnants2.length + remnants3.length)
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

                let first = (newSurvey3[index].answers as RankingAnswer[]).findIndex(a => a._id.$oid === (slug as [string, string])[0])
                let second = (newSurvey3[index].answers as RankingAnswer[]).findIndex(a => a._id.$oid === (slug as [string, string])[1])

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

        updateRemaining()
    }

    async function submit(event: MouseEvent<HTMLButtonElement>): Promise<void> {
        event.preventDefault()
        updateRemaining()
        if (remaining !== 0) {
            notify(({
                message: "Complete all required questions to submit.",
                color: "var(--color-error)"
            }))
            return
        }

        async function submitToServer() {
            // submit survey
            const slug = {
                id: content._id.$oid,
                answers: JSON.parse(JSON.stringify(survey))
            }

            await authenticatedRequest(authentication, API_SURVEY_SUBMIT, "POST", slug).then(response => {
                let message: string = response.message as string || "Survey Complete!"
                let color: string = "var(--color-text)"

                if ((response as GenericError).error) {
                    message = response.message as string || "Uknown Error"
                    color = "var(--color-error)"
                }
                else {
                    navigation(`/${PAGE_SURVEY_SUBMITTED}`)
                }

                notify({
                    message: message,
                    color: color
                })
            })
        }

        confirm({
            message: "Once you turn a survey in, you cannot take back your submission. Do you still want to continue?",
            loaderText: "Submitting Survey...",
            callback: submitToServer
        })
    }

    return (
        <section className="w-full md:w-[92vw] h-full relative left-[4vw] p-2">
            <SurveyHeader name={content.name} index={index} length={content.questions.length} cycleForward={cycleForward} cycleBackward={cycleBackward} />
            <SurveyContent survey={survey} index={index} editAnswer={editAnswer} />
            <footer className="w-full h-[5vh] flex flex-row justify-end items-end">
                <p className="text-sm mr-2 font-jbm-italic text-inactive">*{remaining} Remaining</p>
                <button onClick={submit} className="z-10 border-2 border-text text-text rounded px-2 font-jbm hover:bg-text hover:text-background hover:cursor-pointer transition" style={remaining === 0 ? undefined : {background: "none", borderColor: "var(--color-accent)", color: "var(--color-accent)"}}>Submit</button>
            </footer>
        </section>
    )
}

export default function TakeSurveyPage() {
    const { id } = useParams()
    const { notify } = useContext(UIContext)
    const authentication = useContext(AuthContext)

    const [content, setContent] = useState<Survey>()
    
    function notFoundPage() {
        window.location.href = `/${generateClientId()}`
    }

    useEffect(() => {
        async function getSurvey() {
            await authenticatedRequest(authentication, API_SURVEY_CATALOG, "POST", { id: id as string }).then(result => {
                if (result.error) {
                    // possible invite permission failure
                    notify({
                        message: result.message as string | undefined || DEFAULT_ERROR_MESSAGE,
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
