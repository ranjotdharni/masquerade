import { useNavigate, useParams } from "react-router-dom"
import AppContent from "../components/layout/AppContent"
import { API_SURVEY_DETAIL, DEFAULT_ERROR_MESSAGE, PAGE_SURVEY_FIND } from "../lib/constants"
import FullScreenLoader from "../components/utility/FullScreenLoader"
import type { Survey } from "../lib/types/api"
import { useContext, useEffect, useState } from "react"
import ViewSurveyHeader from "../components/ViewSurveyPage/ViewSurveyHeader"
import ViewSurveyBody from "../components/ViewSurveyPage/ViewSurveyBody"
import { authenticatedRequest } from "../lib/utility/internal"
import { UIContext } from "../components/context/UIContext"

export default function ViewSurveyPage() {
    const navigate = useNavigate()
    const { notify } = useContext(UIContext)
    const { id } = useParams()

    const [content, setContent] = useState<Survey>()

    if (id === undefined)
        navigate(`/${PAGE_SURVEY_FIND}`)

    function PageContent({ content } : { content: Survey }) {
        return (
            <>
                <ViewSurveyHeader id={content._id.$oid} name={content.name} inviteOnly={content.inviteOnly} />
                <ViewSurveyBody questions={content.questions} />
            </>
        )
    }

    useEffect(() => {
        async function getSurvey() {
            await authenticatedRequest(`${API_SURVEY_DETAIL}?id=${id}`, "GET").then(result => {
                let message = result.message as string || DEFAULT_ERROR_MESSAGE
                let validResult = (result as any)?.content as (Survey[] | undefined)

                if (result.error || validResult === undefined || validResult.length === 0) {
                    notify({
                        message: message,
                        color: "var(--color-error)"
                    })
                }
                else {
                    setContent(validResult[0])
                    console.log(validResult)
                }
            })
        }

        getSurvey()
    }, [id])

    return (
        <AppContent className="flex flex-col justify-center items-center">
            {
                content ?
                <PageContent content={content} /> :
                <FullScreenLoader loaderText={`Searching for ID: ${id}`} width="25%" aspectRatio={"9 / 16"} />
            }
        </AppContent>
    )
}
