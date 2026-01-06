import AppContent from "../components/layout/AppContent"
import MySurveyList from "../components/MySurveysPage/MySurveyList"
import MySurveyHeader from "../components/MySurveysPage/MySurveyHeader"
import { useContext, useEffect, useState } from "react"
import FullScreenLoader from "../components/utility/FullScreenLoader"
import { API_SURVEY_DETAIL } from "../lib/constants"
import { authenticatedRequest } from "../lib/utility/internal"
import { UIContext } from "../components/context/UIContext"
import type { Survey } from "../lib/types/api"

export default function MySurveysPage() {
    const { notify } = useContext(UIContext)
    const [content, setContent] = useState<Survey[] | undefined>()

    function PageContent({ content } : { content: Survey[] }) {
        return (
            <>
                <MySurveyHeader username="ranjotdharni1@gmail.com" numberOfSurveys={content.length} />
                <section className="w-full h-3/4">
                    <MySurveyList surveys={content.map(s => { return {...s, questions: undefined, numberOfQuestions: s.questions.length } })} />
                </section>
            </>
        )
    }
    
    useEffect(() => {
        async function getMySurveys() {
            await authenticatedRequest(API_SURVEY_DETAIL, "GET").then(result => {
                let message = result.message as string || "Unknow Client/Server Error"

                if (result.error) {
                    notify({
                        message: message,
                        color: "var(--color-error)"
                    })
                }
                else {
                    setContent((result as unknown as { content: Survey[] }).content)
                }
            })
        }

        getMySurveys()
    }, [])

    return (
        <AppContent className="border-b border-primary">
            {
                content ?
                <PageContent content={content} /> :
                <FullScreenLoader loaderText="Retrieving Your Surveys..." />
            }
        </AppContent>
    )
}
