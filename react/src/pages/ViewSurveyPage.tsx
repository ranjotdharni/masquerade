import { useNavigate, useParams } from "react-router-dom"
import AppContent from "../components/layout/AppContent"
import { PAGE_SURVEY_FIND } from "../lib/constants"
import FullScreenLoader from "../components/utility/FullScreenLoader"

export default function ViewSurveyPage() {
    const navigate = useNavigate()
    const { id } = useParams()

    if (id === undefined)
        navigate(`/${PAGE_SURVEY_FIND}`)

    return (
        <AppContent className="flex flex-col justify-center items-center">
            {
                <FullScreenLoader loaderText={`Searching for ID: ${id}`} width="25%" aspectRatio={"9 / 16"} />
            }
        </AppContent>
    )
}
