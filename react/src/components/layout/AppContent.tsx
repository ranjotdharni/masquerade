import type { ReactNode } from "react"
import { NAV_CSS } from "../utility/animated/NavBar"

export default function AppContent({ children, className, reserveNavSpace } : { children: ReactNode, className?: string, reserveNavSpace?: boolean }) {

    return (                                                                            // 6.5vh is the width of the minimized navbar (at least at the time of writing this)
        <section style={{width: "100%", height: "95vh", paddingLeft: reserveNavSpace ? NAV_CSS.getX() : undefined}} className={className}>
            { children }
        </section>
    )
}
