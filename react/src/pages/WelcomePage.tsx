import { useState, type MouseEvent } from "react"
import { PAGE_LOGIN, RESERVED_AUTH_STATUSES } from "../lib/constants"
import { getCookie } from "../lib/utility/internal"

export default function WelcomePage() {
    const [message, setMessage] = useState<string>("")

    async function testAPI(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        fetch("https://127.0.0.1:8000/api/auth/signout/", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken") as string,
                "Authorization": `Bearer thisandthat`
            }
        }).then(middle => {
            const reservedAuthStatusIndex: number = RESERVED_AUTH_STATUSES.findIndex(item => item.status === middle.status)

            if (reservedAuthStatusIndex !== -1) {
                setMessage(RESERVED_AUTH_STATUSES[reservedAuthStatusIndex].message)
                window.location.href = "/login"
                return
            }

            setMessage("")
        })
    }

    return (
        <section className="space-y-4 w-full h-[85vh] absolute left-0 top-[10vh] flex flex-col justify-center items-center">
            <h1 className="text-xl font-lato-bold">Welcome to Masquerade!</h1>
            <a href={PAGE_LOGIN} className="font-jbm text-sm appButton">Sign In</a>
            <button onClick={testAPI} className="font-jbm text-sm appButton">Test API</button>
            <p className="text-text font-jbm">{message}</p>
        </section>
    )
}
