import { Plus } from "lucide-react"
import { PAGE_SURVEY_CREATE } from "../../lib/constants"
import { Link } from "react-router-dom"

export default function HeaderSection() {
    return (
        <div className="w-full h-full md:px-1 flex flex-row justify-end items-center">
            <Link to={`/${PAGE_SURVEY_CREATE}`} className="font-roboto flex flex-row items-center py-1.5 px-12 rounded gradientBackgroundButton border-background-light border-[1px] text-accent hover:cursor-pointer hover:shadow-md hover:scale-[101%] active:shadow-none transition-all">
                <Plus className="p-0.5" />
                <p>Create</p>
            </Link>
        </div>
    )
}
