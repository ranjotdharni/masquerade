import "../../../css/utility.css"
import LandingImage from "../../../../public/statisticsScreenshot1.png"
import { IMG_LANDING_BACKGROUND, PAGE_LOGIN } from "../../../lib/constants"

export default function LandingSection() {

    return (
        <section className="relative flex flex-col justify-start items-center">
            <div style={{backgroundImage: `url(${IMG_LANDING_BACKGROUND})`}}  className="landingImageFilters opacity-10 absolute top-0 left-0 w-full h-full bg-cover bg-no-repeat"></div>

            <header style={{zIndex: 1}} className="relative flex flex-col justify-start items-center w-full">
                <h2 className="text-[2rem] font-lato-bold text-text mt-10">Get feedback the right way.</h2>
                <h1 className="text-[3.25rem] text-center font-roboto-bold text-text mt-6 max-w-200">
                    You need <span className="text-primary">data.</span> Your users need <span className="text-primary">privacy.</span> Now you can <span className="text-primary">have both.</span>
                </h1>
                <p className="text-[1.25rem] font-jbm text-text mt-10 text-center max-w-120">
                    Online survey platform that keeps 
                    participants anonymous, and gives 
                    you data-driven insights all from 
                    one place.
                </p>
            </header>

            <a href={`/${PAGE_LOGIN}`} style={{zIndex: 1}} className="mt-10 bg-primary rounded-[100px] text-secondary font-roboto-bold text-2xl px-9 py-3 transition-transform hover:cursor-pointer hover:scale-105">Get Started For Free</a>
            
            <article style={{zIndex: 1}} className="bg-text shadow-xl rounded-xl max-w-250 w-[90vw] md:w-[55%] mt-16 pt-26 flex flex-row justify-center items-end">
                <img src={LandingImage} className="w-[85%] rounded-t-md" />
            </article>
        </section>
    )
}
