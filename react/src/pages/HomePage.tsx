import { useState, type MouseEvent } from "react"
import AppContent from "../components/layout/AppContent"
import { API_CONFIRM_AUTH } from "../lib/constants"
import { authenticatedRequest } from "../lib/utility/internal"
import type { GenericError } from "../lib/types/internal"

export default function HomePage() {
    const [response, setResponse] = useState<string>("")

    async function test(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        const response = await authenticatedRequest(API_CONFIRM_AUTH, "POST")

        if (response.error) {
            setResponse((response as GenericError).message || "Error")
        }
        else {
            setResponse(JSON.stringify(response))
        }
    }

    return (
        <AppContent style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <p className="text-xl font-jbm-bold">{response}</p>
            <p className="font-lato">You are logged in!</p>
            <button onClick={test} className="font-roboto-bold text-accent hover:cursor-pointer hover:text-text">Log Out</button>
        </AppContent>
    )
}
