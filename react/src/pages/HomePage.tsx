import AppContent from "../components/layout/AppContent"
import { Plus } from "lucide-react"
import { PAGE_SURVEY_CREATE } from "../lib/constants"

export default function HomePage() {
    return (
        <AppContent className="flex flex-col justify-center items-center">
            <a href={`/${PAGE_SURVEY_CREATE}`} className="w-4/5 h-4/5 md:w-1/5 md:h-1/2 flex flex-col justify-center items-center gap-4 border-2 border-t-28 border-text hover:border-primary rounded shadow-xl">
                <div className="w-1/5 aspect-square bg-text rounded-[1000px] flex flex-col justify-center items-center">
                    <Plus className="text-background w-1/2 h-full aspect-square" />
                </div>
                <p className="text-text font-jbm">Create Survey</p>
            </a>
        </AppContent>
    )
}
