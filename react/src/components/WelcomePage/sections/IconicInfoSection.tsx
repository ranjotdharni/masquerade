import { ICON_ANONYMOUS, ICON_APEXCHARTS, ICON_DATA, ICON_DJANGO, ICON_GROUP, ICON_MONGO, ICON_OAUTH, ICON_REACT, ICON_UI } from "../../../lib/constants"

export default function IconicInfoSection() {
    const srcArray = [
        {
            src: ICON_REACT,
            alt: "React Icon",
        },
        {
            src: ICON_DJANGO,
            alt: "Django Icon",
        },
        {
            src: ICON_MONGO,
            alt: "MongoDB Icon",
        },
        {
            src: ICON_APEXCHARTS,
            alt: "ApexCharts Icon"
        },
        {
            src: ICON_OAUTH,
            alt: "OAuth Icon",
        }
    ]

    const iconDetailsArray: { src: string, title: string, text: string }[] = [
        {
            src: ICON_UI,
            title: "Friendly Interface",
            text: "Take advantage of our easy-to-use UI.",
        },
        {
            src: ICON_GROUP,
            title: "Target Audiences",
            text: "Control who can and can't give feedback.",
        },
        {
            src: ICON_ANONYMOUS,
            title: "Preserve Anonymity",
            text: "Preserve survey participants' privacy.",
        },
        {
            src: ICON_DATA,
            title: "Visualize Responses",
            text: "See how real results are distributed.",
        }
    ]

    return (
        <section className="w-full flex flex-col items-center mt-16">
            <h3 className="text-2xl font-roboto-bold text-secondary">Built with trusted tools</h3>

            <article className="flex flex-row justify-center space-x-10 mt-6">
                {
                    srcArray.map((detail, index) => {
                        return <img key={`ICONIC_INFO_TOOL_1x${index}`} src={detail.src} alt={detail.alt} className="md:h-16 md:w-auto w-[10%] aspect-square" />
                    })
                }
            </article>

            <article className="flex flex-col md:flex-row items-center md:justify-center md:space-y-0 md:space-x-14 mt-18 space-y-10">
                {
                    iconDetailsArray.map((detail, index) => {
                        return (
                            <figure key={`ICONIC_INFO_DETAIL_1x${index}`} className="flex flex-col justify-end items-center space-y-4">
                                <img src={detail.src} className="md:w-24 aspect-square bg-text p-4 rounded-[100px]" />
                                <h4 className="text-xl text-secondary font-jbm-bold">{detail.title}</h4>
                                <figcaption className="w-40 text-center text-center text-inactive font-roboto-italic">{detail.text}</figcaption>
                            </figure>
                        )
                    })
                }
            </article>
        </section>
    )
}
