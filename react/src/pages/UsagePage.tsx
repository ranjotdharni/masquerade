import BaseFooter from "../components/layout/BaseFooter"
import UniformSection from "../components/UsagePage/UniformSection"
import USAGE from "../components/UsagePage/usage.json"
import type { UniformSectionType } from "../lib/types/client"

export default function UsagePage() {

    return (
        <>
            <header className="relative max-w-400 w-[90%] mx-auto pt-4 pb-10 font-jbm-bold text-text dark:text-secondary text-[2.75rem]">
                <span className="px-8 border-2 rounded bg-accent shadow">Usage</span>
            </header>
            {
                (USAGE as UniformSectionType[]).map((section, index) => {
                    return <UniformSection key={`USAGE_PAGE_SECTION_1x${index}`} title={section.title} content={section.content} reverseTitle={index % 2 === 0} />
                })
            }
            <BaseFooter />
        </>
    )
}
