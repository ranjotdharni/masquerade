import LandingSection from "../components/WelcomePage/sections/LandingSection"
import IconicInfoSection from "../components/WelcomePage/sections/IconicInfoSection"
import InfoGraphicSection from "../components/WelcomePage/sections/InfoGraphicSection"
import StatisticsSection from "../components/WelcomePage/sections/StatisticsSection"
import { HowItWorksSection } from "../components/WelcomePage/sections/HowItWorksSection"
import FAQSection from "../components/WelcomePage/sections/FAQSection"
import BaseFooter from "../components/layout/BaseFooter"

export default function WelcomePage() {
    return (
        <>
            <LandingSection />
            <IconicInfoSection />
            <InfoGraphicSection />
            <StatisticsSection />
            <HowItWorksSection />
            <FAQSection />
            <BaseFooter />
        </>
    )
}
