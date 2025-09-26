import { useParams } from "react-router-dom"
import AppContent from "../components/layout/AppContent"
import { useContext, useEffect, useState } from "react"
import { authenticatedRequest } from "../lib/utility/internal"
import { API_SURVEY_RETRIEVE } from "../lib/constants"
import FullScreenLoader from "../components/utility/FullScreenLoader"
import { UIContext } from "../components/context/UIContext"
import { generateClientId } from "../lib/utility/client"
import type { Survey } from "../lib/types/api"
import SurveyContent from "../components/TakeSurveyPage/SurveyContent"
import SurveyHeader from "../components/TakeSurveyPage/SurveyHeader"

function SurveyContainer({ content } : { content: Survey }) {
    const [index, setIndex] = useState<number>(0)

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

    return (
        <section className="w-[92vw] h-full relative left-[4vw] p-2">
            <SurveyHeader name={content.name} index={index} length={content.questions.length} cycleForward={cycleForward} cycleBackward={cycleBackward} />
            <SurveyContent content={content} index={index} />
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