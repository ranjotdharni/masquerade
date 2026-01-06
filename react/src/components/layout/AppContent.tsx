import type { ReactNode } from "react"

export default function AppContent({ children, className, reserveNavSpace } : { children: ReactNode, className?: string, reserveNavSpace?: boolean }) {

    return (                                                                            // 6.5vh is the width of the minimized navbar (at least at the time of writing this)
        <section style={{width: "100%", height: "95vh", paddingLeft: reserveNavSpace ? "6.5vh" : undefined}} className={className}>
            { children }
        </section>
    )
}
