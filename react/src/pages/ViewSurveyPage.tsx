import { useNavigate, useParams } from "react-router-dom"
import AppContent from "../components/layout/AppContent"
import { PAGE_SURVEY_FIND } from "../lib/constants"
import FullScreenLoader from "../components/utility/FullScreenLoader"
import type { Survey } from "../lib/types/api"
import SampleData from "../sampledata/surveys.json"
import { useState } from "react"
import ViewSurveyHeader from "../components/ViewSurveyPage/ViewSurveyHeader"
import ViewSurveyBody from "../components/ViewSurveyPage/ViewSurveyBody"

export default function ViewSurveyPage() {
    const navigate = useNavigate()
    const { id } = useParams()

    const [content, setContent] = useState<Survey>(SampleData.content as unknown as Survey)

    if (id === undefined)
        navigate(`/${PAGE_SURVEY_FIND}`)

    function PageContent({ content } : { content: Survey }) {
        return (
            <>
                <ViewSurveyHeader />
                <ViewSurveyBody />
            </>
        )
    }

    return (
        <AppContent className="flex flex-col justify-center items-center">
            {
                content ?
                <FullScreenLoader loaderText={`Searching for ID: ${id}`} width="25%" aspectRatio={"9 / 16"} />  : 
                <PageContent content={content} />
            }
        </AppContent>
    )
}
