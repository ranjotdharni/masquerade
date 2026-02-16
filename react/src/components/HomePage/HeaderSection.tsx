import { Plus } from "lucide-react"
import { PAGE_SURVEY_CREATE } from "../../lib/constants"
import { Link } from "react-router-dom"

export default function HeaderSection() {
    return (
        <div className="w-full h-full md:px-1 flex flex-row justify-end items-center">
            <Link to={`/${PAGE_SURVEY_CREATE}`} className="font-roboto flex flex-row space-x-1 py-1 px-4 rounded bg-text text-background dark:hover:text-secondary hover:cursor-pointer hover:shadow-md active:shadow-none transition-all">
                <Plus />
                <p>Create Survey</p>
            </Link>
        </div>
    )
}
