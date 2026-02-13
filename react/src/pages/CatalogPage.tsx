import { useContext, useEffect, useState } from "react"
import AppContent from "../components/layout/AppContent"
import FullScreenLoader from "../components/utility/FullScreenLoader"
import { authenticatedRequest } from "../lib/utility/internal"
import { API_SURVEY_CATALOG, DEFAULT_ERROR_MESSAGE } from "../lib/constants"
import Catalog from "../components/CatalogPage/Catalog"
import { UIContext } from "../components/context/UIContext"
import type { SurveyMetadata } from "../lib/types/api"
import { AuthContext } from "../components/context/AuthContext"

export default function CatalogPage() {
    const authentication = useContext(AuthContext)
    const { notify } = useContext(UIContext)
    const [content, setContent] = useState<SurveyMetadata[] | undefined>()

    useEffect(() => {
        async function getCatalog() {
            await authenticatedRequest(authentication, API_SURVEY_CATALOG, "GET").then(result => {
                let message = result.message as string || DEFAULT_ERROR_MESSAGE
                
                if (result.error) {
                    notify({
                        message: message,
                        color: "var(--color-error)"
                    })
                }
                else {
                    setContent((result as any)["content"] as SurveyMetadata[])
                }
            })
        }

        getCatalog()
    }, [])

    return (
        <AppContent>
            <section className="w-full h-full px-[3.5vw] flex flex-col justify-center items-center overflow-y-scroll border-b border-primary">
                {
                    content ?
                    <Catalog catalogContent={content} /> :
                    <FullScreenLoader loaderText="Retrieving Surveys..." width="25%" aspectRatio={"9 / 16"} />
                }
            </section>
        </AppContent>
    )
}
