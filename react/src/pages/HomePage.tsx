import AppContent from "../components/layout/AppContent"
import HeaderSection from "../components/HomePage/HeaderSection"
import QuickLinkSection from "../components/HomePage/QuickLinkSection"
import InviteSection from "../components/HomePage/InviteSection"
import { NAV_CSS } from "../components/utility/animated/NavBar"

export default function HomePage() {
    return (
        <AppContent className="flex flex-col justify-center items-center overflow-y-scroll md:overflow-hidden">
            <section className={`w-full h-auto md:h-[10%] px-4 py-4 md:py-2 ${NAV_CSS.md_px}`}>
                <HeaderSection />
            </section>
            <section className={`w-full h-auto md:h-[90%] space-y-10 md:space-y-0 px-4 md:py-4 ${NAV_CSS.md_px} md:flex md:flex-row`}>
                <QuickLinkSection />
                <InviteSection />
            </section>
        </AppContent>
    )
}
