import { Outlet } from "react-router-dom"
import AppFooter from "../components/layout/AppFooter"
import AppHeader from "../components/layout/AppHeader"

export default function AppLayout() {
    
    return (
        <>
            <AppHeader />

            <main>
                <Outlet />
            </main>

            <AppFooter />
        </>
    )
}
