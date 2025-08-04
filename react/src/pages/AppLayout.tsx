import { Outlet } from 'react-router-dom'
import AppFooter from '../components/layout/AppFooter'

export default function AppLayout() {
    
    return (
        <>
            <nav>This is the Navigation Bar.</nav>

            <main>
                <Outlet />
            </main>

            <AppFooter />
        </>
    )
}
