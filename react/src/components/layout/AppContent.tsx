import type { CSSProperties, ReactNode } from "react"

export default function AppContent({ children, style } : { children: ReactNode, style?: CSSProperties }) {

    return (
        <section style={style} className="w-full h-[85vh] absolute left-0 top-[10vh]">
            { children }
        </section>
    )
}
