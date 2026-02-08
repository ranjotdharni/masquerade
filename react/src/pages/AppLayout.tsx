import { Outlet } from "react-router-dom"
import AppFooter from "../components/layout/AppFooter"
import { useEffect, useState } from "react"
import { API_CONFIRM_AUTH } from "../lib/constants"
import { authenticatedRequest, clientSignOut } from "../lib/utility/internal"
import NavBar from "../components/utility/animated/NavBar"
import FullScreenLoader from "../components/utility/FullScreenLoader"

function App() {
    return (
        <>
            <NavBar />

            <main>
                <Outlet />
            </main>

            <AppFooter />
        </>
    )
}

export default function AppLayout() {
    const [pageIsLoading, setPageIsLoading] = useState<boolean>(true)

    useEffect(() => {
        // make sure user is signed in to view a page wrapped in AppLayout
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
        <FullScreenLoader /> :
        <App />
    )
}
