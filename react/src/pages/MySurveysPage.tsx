import AppContent from "../components/layout/AppContent"
import MySurveyList from "../components/MySurveysPage/MySurveyList"
import MySurveyHeader from "../components/MySurveysPage/MySurveyHeader"
import { useContext, useEffect, useState } from "react"
import FullScreenLoader from "../components/utility/FullScreenLoader"
import { API_SURVEY_DETAIL, DEFAULT_ERROR_MESSAGE } from "../lib/constants"
import { authenticatedRequest } from "../lib/utility/internal"
import { UIContext } from "../components/context/UIContext"
import type { Survey } from "../lib/types/api"
import { AuthContext } from "../components/context/AuthContext"

export default function MySurveysPage() {
    const authentication = useContext(AuthContext)
    const { notify } = useContext(UIContext)

    const [user, setUser] = useState<string | undefined>()
    const [content, setContent] = useState<Survey[] | undefined>()

    function PageContent({ content } : { content: Survey[] }) {
        return (
            <>
                <MySurveyHeader username={user || ""} numberOfSurveys={content.length} />
                <section className="w-full h-3/4">
                    <MySurveyList surveys={content.map(s => { return {...s, questions: undefined, numberOfQuestions: s.questions.length } })} />
                </section>
            </>
        )
    }
    
    useEffect(() => {
        async function getMySurveys() {
            await authenticatedRequest(authentication, API_SURVEY_DETAIL, "GET").then(result => {
                let message = result.message as string || DEFAULT_ERROR_MESSAGE

                if (result.error) {
                    notify({
                        message: message,
                        color: "var(--color-error)"
                    })
                }
                else {
                    setUser((result as unknown as { user: string }).user)
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
