import { Link } from "react-router-dom"
import { APP_NAME, EXTERNAL_GITHUB_ISSUES, EXTERNAL_GITHUB_PULL_REQUEST, EXTERNAL_GITHUB_SOURCE, ICON_LOGO_STICKER, PAGE_ABOUT, PAGE_LOGIN, PAGE_USAGE } from "../../lib/constants"

type LinkSectionType = {
    title: string
    external: boolean
    links: { text: string, href: string }[]
}

function LinkSection({ title, external, links } : LinkSectionType) {

    return (
        <div className="flex flex-col items-start space-y-4">
            <h5 className="text-accent font-jbm-bold">{title}</h5>
            <ul className="space-y-4">
                {
                    links.map((link, index) => {
                        return (
                            <li key={`WELCOME_PAGE_END_LINK_2x${index}`}>
                                {
                                    external ? 
                                    <a href={link.href} target="_blank" className="w-full h-full text-background font-jbm hover:underline">{link.text}</a> : 
                                    <Link to={link.href} className="w-full h-full text-background font-jbm hover:underline">{link.text}</Link>
                                }
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default function BaseFooter() {
    const linkSections: LinkSectionType[] = [
        {
            title: "Product",
            external: false,
            links: [
                {
                    text: "Get Started",
                    href: `/${PAGE_LOGIN}`,
                },
                {
                    text: "Usage",
                    href: `/${PAGE_USAGE}`,
                },
                {
                    text: "About",
                    href: `/${PAGE_ABOUT}`,
                },
            ]
        },
        {
            title: "External",
            external: true,
            links: [
                {
                    text: "Source",
                    href: EXTERNAL_GITHUB_SOURCE,
                },
                {
                    text: "Contribute",
                    href: EXTERNAL_GITHUB_PULL_REQUEST,
                },
                {
                    text: "Issue",
                    href: EXTERNAL_GITHUB_ISSUES,
                },
            ]
        },
    ]

    const creditLinks: { title: string, href: string }[] = [
        {
            title: "Pexels",
            href: "https://www.pexels.com/",
        },
        {
            title: "Unsplash",
            href: "https://unsplash.com/",
        },
        {
            title: "Seraph Secure",
            href: "https://www.seraphsecure.com/",
        },
        {
            title: "Wikimedia",
            href: "https://commons.wikimedia.org/wiki/Main_Page"
        }
    ]

    return (
        <section className="w-full bg-text flex flex-col items-center py-10 mt-10 md:mt-20">
            <article className="w-4/5 max-w-275 flex flex-col items-center">
                <div className="w-full flex flex-col md:flex-row md:justify-between items-center md:items-start">
                    <header className="w-full md:w-auto flex flex-col items-center space-y-1">
                        <h4 className="w-full md:w-auto flex flex-row justify-between md:justify-center items-center p-1 md:space-x-2">
                            <img src={ICON_LOGO_STICKER} className="h-10 aspect-square" />
                            <p className="text-xl text-background font-jbm-bold">{APP_NAME}</p>
                        </h4>
                        <Link to={`/${PAGE_LOGIN}`} className="min-w-full font-roboto text-background flex flex-row justify-center py-2 border border-background rounded-[100px]">Get Started</Link>
                    </header>
                    <ul className="w-full md:w-auto flex flex-row justify-between md:justify-center items-center mt-6 md:mt-0 md:space-x-16">
                        {
                            linkSections.map((linkSection, index) => {
                                return <LinkSection key={`WELCOME_PAGE_END_LINK_1x${index}`} title={linkSection.title} external={linkSection.external} links={linkSection.links} />
                            })
                        }
                    </ul>
                </div>

                <aside className="w-full px-1 py-2 flex flex-col md:flex-row md:justify-between items-center pt-12 pb-4 space-y-2 md:space-y-0">
                    <h5 className="text-accent font-jbm-italic">Accreditations</h5>
                    <ul className="flex flex-row justify-center items-center space-x-4">
                        {
                            creditLinks.map((creditLink, index) => {
                                return <a key={`WELCOME_PAGE_END_CREDIT_LINK_1x${index}`} href={creditLink.href} target="_blank" className="text-background font-roboto hover:underline">{creditLink.title}</a>
                            })
                        }
                    </ul>
                </aside>
            </article>

            <div className="w-4/5 max-w-280 h-[1vh] md:h-[2vh] border-t border-t-background"></div>
        </section>
    )
}
