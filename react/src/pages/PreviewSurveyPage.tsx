import { useNavigate, useParams } from "react-router-dom"
import AppContent from "../components/layout/AppContent"
import { useContext, useEffect, useState } from "react"
import { UIContext } from "../components/context/UIContext"
import { API_SURVEY_CATALOG, DEFAULT_ERROR_MESSAGE, PAGE_SURVEY_FIND } from "../lib/constants"
import FullScreenLoader from "../components/utility/FullScreenLoader"
import { authenticatedRequest } from "../lib/utility/internal"
import type { SurveyMetadata } from "../lib/types/api"
import PreviewSurveyHeader from "../components/PreviewSurveyPage/PreviewSurveyHeader"
import PreviewSurveyBody from "../components/PreviewSurveyPage/PreviewSurveyBody"

export default function PreviewSurveyPage() {
    const { notify } = useContext(UIContext)
    const navigate = useNavigate()
    const { id } = useParams()

    if (id === undefined)
        navigate(`/${PAGE_SURVEY_FIND}`)

    const [content, setContent] = useState<SurveyMetadata>()

    function PageContent({ content } : { content: SurveyMetadata }) {
        return (
            <>
                <PreviewSurveyHeader name={content.name} inviteOnly={content.inviteOnly} />
                <PreviewSurveyBody id={content._id.$oid} numberOfQuestions={content.numberOfQuestions} />
            </>
        )
    }

    useEffect(() => {
        async function getSurvey() {
            await authenticatedRequest(`${API_SURVEY_CATALOG}?id=${id}`, "GET").then(result => {
                let message = result.message as string || DEFAULT_ERROR_MESSAGE

                if (result.error) {
                    notify({
                        message: message,
                        color: "var(--color-error)"
                    })
                }
                else {
                    setContent((result as unknown as { content: SurveyMetadata[] }).content[0] as unknown as SurveyMetadata)
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
                <FullScreenLoader loaderText="Retrieving Survey..." width="25%" aspectRatio={"9 / 16"} />
            }
        </AppContent>
    )
}
