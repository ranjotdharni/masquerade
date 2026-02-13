import { Outlet } from "react-router-dom"
import AppFooter from "../components/layout/AppFooter"
import NavBar from "../components/utility/animated/NavBar"
import { AuthProvider } from "../components/context/provider/AuthProvider"

export default function AppLayout() {
    return (
        <AuthProvider accessToken="" refreshTokens={async () => undefined}>
            <NavBar />

            <main>
                <Outlet />
            </main>

            <AppFooter />
        </AuthProvider>
    )
}
