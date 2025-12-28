import { useParams } from "react-router-dom"
import AppContent from "../components/layout/AppContent"
import { useContext } from "react"
import { UIContext } from "../components/context/UIContext"

export default function ViewSurveyPage() {
    const { id } = useParams()
    const { notify } = useContext(UIContext)

    return (
        <AppContent>
            <h1>{id}</h1>
        </AppContent>
    )
}
