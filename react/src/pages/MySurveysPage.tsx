import { useEffect, useState } from "react"
import AppContent from "../components/layout/AppContent"
import FullScreenLoader from "../components/utility/FullScreenLoader"
import { authenticatedRequest } from "../lib/utility/internal"
import { API_SURVEY_CATALOG } from "../lib/constants"
import Catalog from "../components/CatalogPage/Catalog"
import type { RecursiveObject } from "../lib/types/internal"

export default function CatalogPage() {
    const [content, setContent] = useState<Record<string | number | symbol, RecursiveObject<string | number | boolean>>[] | undefined>()

    useEffect(() => {
        // placeholder function. for now, just fills page with all existing surveys.
        async function getCatalog() {
            await authenticatedRequest(API_SURVEY_CATALOG, "GET").then(result => {
                setContent((result as any)["content"] as Record<string | number | symbol, RecursiveObject<string | number | boolean>>[])
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
                    <FullScreenLoader loaderText="Loading Your Surveys..." width="25%" aspectRatio={"9 / 16"} />
                }
            </section>
        </AppContent>
    )
}
