import type { ReactNode } from "react"

export default function AppContent({ children, className } : { children: ReactNode, className?: string }) {

    return (
        <section style={{width: "100%", height: "95vh"}} className={className}>
            { children }
        </section>
    )
}
