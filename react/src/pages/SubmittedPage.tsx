import { CheckCircle2 } from "lucide-react"
import AppContent from "../components/layout/AppContent"
import { useContext, useEffect, useState } from "react"
import { UIContext } from "../components/context/UIContext"
import { PAGE_HOME } from "../lib/constants"

export default function SubmittedPage() {
    const { notify } = useContext(UIContext)
    const [ts] = useState<string>((new Date()).toLocaleTimeString())

    useEffect(() => {
        setTimeout(() => {
            notify({
                message: "Thank you for your submission!",
                color: "var(--color-success)",
            })
        }, 300)
    }, [])

    return (
        <AppContent className="flex flex-col justify-center items-center space-y-18">
            <header className="absolute w-[90vw] left-[10vw] top-4 pr-6 flex flex-row justify-end items-center">
                <aside className="border rounded border-accent pl-20 pr-2 py-1 flex flex-col justify-evenly items-end">
                    <p className="mr-1 font-roboto-italic text-text">Timestamp</p>
                    <p className="mr-1 font-jbm text-inactive">{ts}</p>
                </aside>
            </header>

            <span className="flex flex-col items-center space-y-2">
                <h1 className="font-jbm-bold text-2xl text-primary">Survey Submitted!</h1>
                <h2 className="font-jbm-bold text-lg text-text">You may exit this page.</h2>
            </span>
            <span className="popIn" style={{animationDuration: "0.5s"}}>
                <CheckCircle2 className="scale-[5] text-text" />
            </span>
            <a href={`/${PAGE_HOME}`} className="appButton">Home</a>
        </AppContent>
    )
}
