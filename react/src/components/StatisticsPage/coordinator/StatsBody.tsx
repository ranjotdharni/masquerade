import { NAV_CSS } from "../../utility/animated/NavBar"

export default function StatsBody() {

    return (
        <section style={{height: `calc(100% - ${NAV_CSS.getY()})`}} className={`w-full ${NAV_CSS.md_px}`}>
            <div className="w-full h-full"></div>
        </section>
    )
}
