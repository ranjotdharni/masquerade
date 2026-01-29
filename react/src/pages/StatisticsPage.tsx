import { useContext, useEffect, useState } from "react"
import type { Survey } from "../lib/types/api"
import AppContent from "../components/layout/AppContent"
import PageCoordinator from "../components/StatisticsPage/PageCoordinator"
import FullScreenLoader from "../components/utility/FullScreenLoader"
import { useNavigate, useParams } from "react-router-dom"
import { UIContext } from "../components/context/UIContext"
import { API_SURVEY_DETAIL, DEFAULT_ERROR_MESSAGE, PAGE_SURVEY_VIEW } from "../lib/constants"
import { authenticatedRequest } from "../lib/utility/internal"

export default function StatisticsPage() {
    const navigate = useNavigate()
    const { notify } = useContext(UIContext)
    const { id } = useParams()

    const [content, setContent] = useState<Survey>()

    if (id === undefined)
        navigate(`/${PAGE_SURVEY_VIEW}`)

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
                }
            })
        }

        getSurvey()
    }, [id])

    return (
        <AppContent className="flex flex-col justify-start items-center overflow-y-scroll md:overflow-y-hidden">
            {
                content ?
                <PageCoordinator content={content} /> :
                <FullScreenLoader loaderText="Retrieving Statistics..." width="25%" aspectRatio={"9 / 16"} />
            }
        </AppContent>
    )
}
