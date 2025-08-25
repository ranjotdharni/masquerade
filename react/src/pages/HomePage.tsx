import { useContext } from "react"
import AppContent from "../components/layout/AppContent"
import { UIContext } from "../components/context/UIContext"

export default function HomePage() {
    const { notify, confirm } = useContext(UIContext)

    return (
        <AppContent style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '5px'}}>
            <p className="font-lato">You are logged in!</p>
            <button className="appButton" onClick={() => { notify({ message: "This is a notification.", color: "var(--color-error)" }) }}>Notify</button>
            <button className="appButton" onClick={() => { confirm({ message: "Do you want to continue?", callback: () => { notify({ message: "Test Successful!", color: "var(--color-text)" }) } }) }}>Confirm</button>
        </AppContent>
    )
}
