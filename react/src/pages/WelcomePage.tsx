import LandingSection from "../components/WelcomePage/sections/LandingSection"
import IconicInfoSection from "../components/WelcomePage/sections/IconicInfoSection"
import InfoGraphicSection from "../components/WelcomePage/sections/InfoGraphicSection"
import StatisticsSection from "../components/WelcomePage/sections/StatisticsSection"

export default function WelcomePage() {
    return (
        <>
            <LandingSection />
            <IconicInfoSection />
            <InfoGraphicSection />
            <StatisticsSection />

            <div className="w-full h-[5vh]"></div>
        </>
    )
}
