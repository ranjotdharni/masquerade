import type { ReactNode } from "react"

export default function AppContent({ children, className } : { children: ReactNode, className?: string }) {

    return (
        <section style={{width: "100%", height: "85vh", position: "absolute", left: 0, top: "10vh"}} className={className}>
            { children }
        </section>
    )
}
