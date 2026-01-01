import { useNavigate, useParams } from "react-router-dom"
import AppContent from "../components/layout/AppContent"
import { useContext, useState } from "react"
import { UIContext } from "../components/context/UIContext"
import { PAGE_SURVEY_FIND } from "../lib/constants"
import FullScreenLoader from "../components/utility/FullScreenLoader"

export default function PreviewSurveyPage() {
    const { notify } = useContext(UIContext)
    const navigate = useNavigate()
    const { id } = useParams()

    if (id === undefined)
        navigate(`/${PAGE_SURVEY_FIND}`)

    const [loader, setLoader] = useState<boolean>(false)

    return (
        <AppContent className="flex flex-col justify-center items-center">
            {
                loader ?
                <FullScreenLoader loaderText="Retrieving Survey..." width="25%" aspectRatio={"9 / 16"} /> :
                <h1>Searching for Id: {id}</h1>
            }
        </AppContent>
    )
}
