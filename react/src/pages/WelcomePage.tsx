import LandingSection from "../components/WelcomePage/sections/LandingSection"
import IconicInfoSection from "../components/WelcomePage/sections/IconicInfoSection"
import InfoGraphicSection from "../components/WelcomePage/sections/InfoGraphicSection"

export default function WelcomePage() {
    return (
        <>
            <LandingSection />
            <IconicInfoSection />
            <InfoGraphicSection />

            <div className="w-full h-[5vh]"></div>
        </>
    )
}
