import { useState, type MouseEvent } from "react"
import AppContent from "../components/layout/AppContent"
import { API_CONFIRM_AUTH } from "../lib/constants"
import { getCookie } from "../lib/utility/internal"

export default function HomePage() {
    const [response, setResponse] = useState<string>("")

    async function test(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        const csrfCookie = getCookie(import.meta.env.VITE_CSRF_COOKIE_NAME)

        if (csrfCookie == null) {
            setResponse("Failed to get cookie")
            return
        }

        await fetch(`${import.meta.env.VITE_BACKEND_URL}${API_CONFIRM_AUTH}`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfCookie
            }
        }).then(middle => { 
            return middle.json()
        }).then(response => {
            setResponse(JSON.stringify(response))
        })
    }

    return (
        <AppContent style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <p className="text-xl font-jbm-bold">{response}</p>
            <p className="font-lato">You are logged in!</p>
            <button onClick={test} className="font-roboto-bold text-accent hover:cursor-pointer hover:text-text">Log Out</button>
        </AppContent>
    )
}
