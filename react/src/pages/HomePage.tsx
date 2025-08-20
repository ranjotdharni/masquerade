import { useState } from "react"
import AppContent from "../components/layout/AppContent"

export default function HomePage() {
    const [response, setResponse] = useState<string>("")

    return (
        <AppContent style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <p className="text-xl font-jbm-bold">{response}</p>
            <p className="font-lato">You are logged in!</p>
        </AppContent>
    )
}
