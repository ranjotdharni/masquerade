import AppContent from "../components/layout/AppContent"

export default function HomePage() {
    return (
        <AppContent style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <p className="font-lato">You are logged in!</p>
        </AppContent>
    )
}
