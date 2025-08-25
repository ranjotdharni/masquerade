import { Outlet } from "react-router-dom"
import AppFooter from "../components/layout/AppFooter"
import AppHeader from "../components/layout/AppHeader"
import { useEffect, useState } from "react"
import Loader from "../components/utility/Loader"
import { API_CONFIRM_AUTH, ICON_LOGO_STICKER } from "../lib/constants"
import { authenticatedRequest, clientSignOut } from "../lib/utility/internal"
import { UIProvider } from "../components/context/provider/UIProvider"

function ContentLoader() {
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center space-y-4">
            <img src={ICON_LOGO_STICKER} className="w-16 aspect-sqaure bounceDelay" />
            <div className="w-10 aspect-square">
                <Loader />
            </div>
            <p className="text-text font-jbm pulse">Masquerade is Loading...</p>
        </div>
    )
}

function App() {
    return (
        <UIProvider notify={() => {}} confirm={() => {}}>
            <AppHeader />

            <main>
                <Outlet />
            </main>

            <AppFooter />
        </UIProvider>
    )
}

export default function AppLayout() {
    const [pageIsLoading, setPageIsLoading] = useState<boolean>(true)

    useEffect(() => {
        async function performAuthCheck() {
            const authResult = await authenticatedRequest(API_CONFIRM_AUTH, "POST")

            if (authResult.error) {
                clientSignOut()
            }
            else {
                setPageIsLoading(false)
            }
        }

        if (import.meta.env.VITE_CONFIRM_AUTH === "true")
            performAuthCheck()
        else
            setPageIsLoading(false)
    }, [])
    
    return (
        pageIsLoading ? 
        <ContentLoader /> :
        <App />
    )
}
