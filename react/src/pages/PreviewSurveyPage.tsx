import { useNavigate, useParams } from "react-router-dom"
import AppContent from "../components/layout/AppContent"
import { useContext, useEffect, useState } from "react"
import { UIContext } from "../components/context/UIContext"
import { API_SURVEY_CATALOG, PAGE_SURVEY_FIND } from "../lib/constants"
import FullScreenLoader from "../components/utility/FullScreenLoader"
import { authenticatedRequest } from "../lib/utility/internal"

export default function PreviewSurveyPage() {
    const { notify } = useContext(UIContext)
    const navigate = useNavigate()
    const { id } = useParams()

    if (id === undefined)
        navigate(`/${PAGE_SURVEY_FIND}`)

    const [content, setContent] = useState<any>()

    useEffect(() => {
        async function getSurvey() {
            await authenticatedRequest(`${API_SURVEY_CATALOG}?id=${id}`, "GET").then(result => {
                let message = result.message as string || "Unknow Client/Server Error"

                if (result.error) {
                    notify({
                        message: message,
                        color: "var(--color-error)"
                    })
                }
                else {
                    setContent(result)
                }
            })
        }

        getSurvey()
    }, [id])

    return (
        <AppContent className="flex flex-col justify-center items-center">
            {
                content ?
                <pre>{JSON.stringify(content)}</pre> :
                <FullScreenLoader loaderText="Retrieving Survey..." width="25%" aspectRatio={"9 / 16"} />
            }
        </AppContent>
    )
}
