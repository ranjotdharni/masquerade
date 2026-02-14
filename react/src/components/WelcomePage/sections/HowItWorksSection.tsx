import { Link } from "react-router-dom"
import { APP_NAME, IMG_LANDING_EASY_TO_USE, IMG_LANDING_MEANINGFUL_DATA, IMG_LANDING_SIGN_UP, PAGE_LOGIN } from "../../../lib/constants"

type WorkingDetailsType = {
    src: string
    title: string
    bullets: string[]
}

function WorkingDetails({ src, title, bullets } : WorkingDetailsType) {
    
    return (
        <li className="flex flex-col items-center">
            <img src={src} className="w-[90%] md:w-auto md:h-70 rounded-xl" />
            <h3 className="text-secondary text-[1.5rem] font-roboto-bold mt-6 max-w-100 md:text-left text-center">{title}</h3>
            <ul className="flex flex-col items-start list-disc mt-4 space-y-2">
                {
                    bullets.map((b, i) => {
                        return <li key={`LANDING_WORKING_DETAIL_2x${i}`} className="text-text text-[1.1rem] font-jbm-bold max-w-80">{b}</li>
                    })
                }
            </ul>
        </li>
    )
}

export function HowItWorksSection() {
    const workingDetails: WorkingDetailsType[] = [
        {
            src: IMG_LANDING_SIGN_UP,
            title: "Sign up and start getting real feedback from real people",
            bullets: [
                "Get started for completely free",
                "Never unnecessarily reveal data about your users",
                "Protect yourself and your users' privacy",
            ]
        },
        {
            src: IMG_LANDING_EASY_TO_USE,
            title: "No installation required, completely hassle-free",
            bullets: [
                "Bypass platform compatibility issues entirely in the browser",
                "Use your Google or GitHub account to sign in",
                "Responsive design for mobile, on-the-go use",
            ]
        },
        {
            src: IMG_LANDING_MEANINGFUL_DATA,
            title: "Visualize data to extract meaningful statistical insights",
            bullets: [
                "See results with an easy-to-use dashboard",
                "Manage your data collection all from one place",
                "Leverage access controls by survey by user",
            ]
        }
    ]

    return (
        <section className="w-full flex flex-col items-center mt-10 md:mt-24">
            <h2 className="text-[2.5rem] font-roboto-bold text-text text-center px-4 md:px-0">How does {APP_NAME} work?</h2>

            <ul className="flex flex-col items-center space-y-10 md:flex-row md:justify-center md:space-y-0 md:space-x-10 mt-12">
                {
                    workingDetails.map((details, index) => {
                        return <WorkingDetails key={`LANDING_WORKING_DETAIL_1x${index}`} src={details.src} title={details.title} bullets={details.bullets} />
                    })
                }
            </ul>

            <Link to={`/${PAGE_LOGIN}`} style={{zIndex: 1}} className="mt-10 bg-primary rounded-[100px] text-background font-roboto-bold text-[1.3rem] px-10 py-3 transition-transform hover:cursor-pointer hover:scale-105">Start For Free Now</Link>
        </section>
    )
}
