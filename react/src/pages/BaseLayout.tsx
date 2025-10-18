import { Outlet } from "react-router-dom"
import AppFooter from "../components/layout/AppFooter"
import BaseHeader from "../components/layout/BaseHeader"

// Unauthenticated layout; loaders, auth check, etc. not needed
export default function BaseLayout() {
    
    return (
        <>
            <BaseHeader />

            <main>
                <Outlet />
            </main>

            <AppFooter />
        </>
    )
}