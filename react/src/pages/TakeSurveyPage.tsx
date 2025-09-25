import { useParams } from "react-router-dom"
import AppContent from "../components/layout/AppContent"
import { useContext, useEffect, useState } from "react"
import { authenticatedRequest } from "../lib/utility/internal"
import { API_SURVEY_RETRIEVE } from "../lib/constants"
import FullScreenLoader from "../components/utility/FullScreenLoader"
import { UIContext } from "../components/context/UIContext"
import { generateClientId } from "../lib/utility/client"

export default function TakeSurveyPage() {
    const { id } = useParams()
    const { notify } = useContext(UIContext)

    const [loader, setLoader] = useState<boolean>(true)

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
                    console.log((result as any)["content"])
                }

                setLoader(false)
            })
        }

        getSurvey()
    }, [])

    return (
        <AppContent>
            {
                loader ? 
                <FullScreenLoader /> :
                <h1>Take survey page...</h1>
            }
        </AppContent>
    )
}