import { APP_NAME, ICON_LOGO, ICON_LOGO_STICKER } from "../lib/constants"

export default function AboutPage() {
    const iconTailwind: string = "h-full aspect-square"
    const iconContainerTailwind: string = "relative w-full h-[10vh] flex flex-row justify-between items-center"

    return (
        <section className="relative w-full md:h-[60vh] flex flex-col justify-center items-center">
            <div className="hidden w-full h-full absolute p-6 z-0 top-[10vh] left-0 md:flex flex-col justify-between items-center">
                <div className={iconContainerTailwind}>
                    <img src={ICON_LOGO} className={iconTailwind + " -rotate-15"} />
                    <img src={ICON_LOGO_STICKER} className={iconTailwind + " rotate-15"} />
                </div>
                <div className={iconContainerTailwind}>
                    <img src={ICON_LOGO_STICKER} className={iconTailwind + " rotate-15"} />
                    <img src={ICON_LOGO} className={iconTailwind + " -rotate-15"} />
                </div>
            </div>

            <header className="relative max-w-400 mx-auto font-jbm-bold text-text dark:text-secondary text-[2.75rem] mt-6 md:mt-0">
                <span className="px-8 border-2 rounded bg-accent shadow">About</span>
            </header>

            <p className="relative mt-10 mb-10 md:mt-0 md:mb-0 md:top-[10vh] w-[80%] text-text font-jbm">
                {APP_NAME} is a web-based survey platform. Create surveys, let participants give their feedback, and visually analyze the results using our easy-to-use Statistics Dashboard. Give your 
                customers peace of mind by ensuring their online privacy is preserved. {APP_NAME} prides itself on never sharing nor collecting user data. We've taken the steps necessary to ensure user data is never 
                revealed, even to other users of the platform. Now more than ever, people are concerned with how their private information is being collected and exchanged without their knowledge on the internet. {APP_NAME} takes 
                this consideration off your shoulders; make it easy for your users and yourself by focusing on data-driven insights rather than worrying about the technical privacy concerns of a third-party 
                service. {APP_NAME} keeps users anonymous, never collects private user data, and the best part? You can start for completely free! Note that {APP_NAME} is currently headed and developed by one 
                person (subject to change). For a large-scale organization, we do recommend that another survey provider capable of enterprise-level data insights be employed. However, {APP_NAME} is a great place to get 
                started and it costs you nothing, so why not get started? Enjoy our easy-to-use, privacy-first service that works for you and your customers.
            </p>
        </section>
    )
}
