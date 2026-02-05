import { ChevronRight, CircleQuestionMark, ListChecks, NotebookText, TextSearch, type LucideIcon } from "lucide-react"
import { PAGE_ABOUT, PAGE_SURVEY_FIND, PAGE_SURVEY_VIEW, PAGE_USAGE } from "../../lib/constants"

export default function QuickLinkSection() {
    const quickLinks = [
        {
            name: "Browse Surveys",
            href: `/${PAGE_SURVEY_FIND}`,
            Icon: TextSearch,
        },
        {
            name: "View Your Surveys",
            href: `/${PAGE_SURVEY_VIEW}`,
            Icon: ListChecks,
        },
        {
            name: "Usage",
            href: `/${PAGE_USAGE}`,
            Icon: NotebookText,
        },
        {
            name: "About",
            href: `/${PAGE_ABOUT}`,
            Icon: CircleQuestionMark,
        },
    ]

    function QuickLink({ name, href, Icon } : { name: string, href: string, Icon: LucideIcon }) {

        return (
            <li className="group w-full h-30 border border-text bg-primary text-text hover:text-background rounded-lg">
                <a href={href} className="w-full h-full flex flex-row items-center justify-between px-8">
                    <span className="flex flex-row items-center space-x-6">
                        <Icon className="h-10 w-10 border-2 p-1 border-text group-hover:border-background rounded" />
                        <p className="font-jbm text-[1.25rem] underline">{name}</p>
                    </span>
                    <ChevronRight />
                </a>
            </li>
        )
    }

    return (
        <aside className="w-full h-auto md:w-1/2 md:h-full md:pl-4">
            <h2 className="text-[2.5rem] font-jbm-bold text-text px-4 border border-2 border-text mb-10">Quick Links</h2>
            <ul className="w-full md:w-2/3 space-y-6">
                {
                    quickLinks.map((link, index) => {
                        return <QuickLink key={`HOME_QUICK_LINK_1x_${index}`} name={link.name} href={link.href} Icon={link.Icon} />
                    })
                }
            </ul>
        </aside>
    )
}
