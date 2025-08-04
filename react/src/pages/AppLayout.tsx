import { Outlet } from 'react-router-dom'

export default function AppLayout() {
    
    return (
        <>
            <nav>This is the Navigation Bar.</nav>

            <main>
                <Outlet />
            </main>
        </>
    )
}
