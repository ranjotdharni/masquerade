import { useState, type MouseEvent } from "react"
import AppContent from "../components/layout/AppContent"
import { authenticatedRequest } from "../lib/utility/internal"
import type { GenericError } from "../lib/types/internal"

export default function HomePage() {
    const [response, setResponse] = useState<string>("")

    const [message, setMessage] = useState<string>("")
    
    async function testAPI(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        const response = await authenticatedRequest("/api/auth/test/", "POST")

        if (response.error) {
            setMessage((response as GenericError).message ? (response as GenericError).message as string : "Error")
        }
        else {
            setMessage(response.message as string)
        }
    }

    return (
        <AppContent style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <p className="text-xl font-jbm-bold">{response}</p>
            <p className="font-lato">You are logged in!</p>

            <button onClick={testAPI} className="font-jbm text-sm appButton">Test API</button>
            <p className="text-text font-jbm">{message}</p>
        </AppContent>
    )
}
