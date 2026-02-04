import { APP_NAME, IMG_LANDING_DATA_VISUALIZATION, IMG_LANDING_TARGET_AUDIENCE, IMG_LANDING_USER_PRIVACY, PAGE_LOGIN, PAGE_USAGE } from "../../../lib/constants"

type InfoGraphicType = { 
    src: string, 
    title: string, 
    text: string, 
    buttonText: string,
    reverse: boolean,
}

function InfoGraphic({ src, title, text, buttonText, reverse } : InfoGraphicType) {
    return (
        <li className={`w-full md:w-auto flex flex-col ${ reverse ? "md:flex-row-reverse" : "md:flex-row" }`}>
            <img src={src} alt="infographic" className="w-[90%] md:w-auto md:h-78 aspect-video rounded-xl mx-auto md:mx-16" />

            <div className="flex flex-col justify-evenly items-center md:items-start text-left max-w-130 py-2 space-y-6 md:space-y-0">
                <h4 className="text-text text-center md:text-left font-roboto-bold text-[1.75rem] md:text-[2.2rem]/10 px-3 md:px-0">{title}</h4>
                <p className="text-center md:text-left font-jbm text-secondary text-[1.1rem] px-3 md:px-0">{text}</p>
                <a href={`/${PAGE_LOGIN}`} className="font-roboto-bold text-background px-9 py-3 text-[1.4rem] bg-gradient-to-r from-primary to-text rounded-[100px] hover:cursor-pointer transition-transform hover:cursor-pointer hover:scale-105">{buttonText}</a>
            </div>
        </li>
    )
}

export default function InfoGraphicSection() {
    const infographics: InfoGraphicType[] = [
        {
            src: IMG_LANDING_TARGET_AUDIENCE,
            title: "Target specific users",
            text: "Take advantage of access controls on your surveys for public or private audiences.",
            buttonText: "Get Started Now",
            reverse: false,
        },
        {
            src: IMG_LANDING_USER_PRIVACY,
            title: "Keep survey participants anonymous",
            text: "Now more than ever, users are concerned with their online privacy. Make the choice to give them peace of mind and let us handle the rest.",
            buttonText: "Protect Your Users",
            reverse: true,
        },
        {
            src: IMG_LANDING_DATA_VISUALIZATION,
            title: "User-friendly visualization",
            text: "Our statistics dashboard lets you review data and find insights from the comfort of an appealing UI.",
            buttonText: `Use ${APP_NAME}`,
            reverse: false,
        },
    ]

    return (
        <section className="w-full mt-16">
            <header className="w-full flex flex-col items-center justify-center">
                <h3 className="text-[2rem] font-roboto-bold text-primary text-center">Keep Up With Your Audience Through {APP_NAME}</h3>
                <a href={`${PAGE_USAGE}`} className="mt-4 text-[1.3rem] font-roboto-bold text-text underline hover:cursor-pointer">How it works</a>
            </header>

            <ul className="w-full flex flex-col items-center space-y-12 md:space-y-40 pt-16 md:pt-18">
                {
                    infographics.map((info, index) => {
                        return (
                            <InfoGraphic key={`INFOGRAPHIC_ITEM_1x${index}`} src={info.src} title={info.title} text={info.text} buttonText={info.buttonText} reverse={info.reverse} />
                        )
                    })
                }
            </ul>
        </section>
    )
}
