import { useState } from "react"
import type { Survey } from "../lib/types/api"
import AppContent from "../components/layout/AppContent"
import PageCoordinator from "../components/StatisticsPage/PageCoordinator"
import FullScreenLoader from "../components/utility/FullScreenLoader"

export default function StatisticsPage() {
    const [content, setContent] = useState<Survey>()

    return (
        <AppContent className="flex flex-col justify-center items-center">
            {
                content ?
                <PageCoordinator content={content} /> :
                <FullScreenLoader loaderText="Retrieving Statistics..." width="25%" aspectRatio={"9 / 16"} />
            }
        </AppContent>
    )
}
