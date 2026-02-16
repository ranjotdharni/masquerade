import { useNavigate, useParams } from "react-router-dom"
import AppContent from "../components/layout/AppContent"
import { API_SURVEY_DETAIL, DEFAULT_ERROR_MESSAGE, PAGE_SURVEY_FIND } from "../lib/constants"
import FullScreenLoader from "../components/utility/FullScreenLoader"
import type { Survey } from "../lib/types/api"
import { useContext, useEffect, useState } from "react"
import { authenticatedRequest } from "../lib/utility/internal"
import { UIContext } from "../components/context/UIContext"
import PageCoordinator from "../components/ViewSurveyPage/PageCoordinator"
import { AuthContext } from "../components/context/AuthContext"

export default function ViewSurveyPage() {
    const navigate = useNavigate()
    const authentication = useContext(AuthContext)
    const { notify } = useContext(UIContext)
    const { id } = useParams()

    const [content, setContent] = useState<Survey>()

    if (id === undefined)
        navigate(`/${PAGE_SURVEY_FIND}`)

    useEffect(() => {
        async function getSurvey() {
            await authenticatedRequest(authentication, `${API_SURVEY_DETAIL}?id=${id}`, "GET").then(result => {
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
                }
            })
        }

        getSurvey()
    }, [id])

    return (
        <AppContent className="flex flex-col justify-center items-center">
            {
                content ?
                <PageCoordinator content={content} /> :
                <FullScreenLoader loaderText="Retrieving Survey Details..." width="25%" aspectRatio={"9 / 16"} />
            }
        </AppContent>
    )
}
