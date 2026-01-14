import { ChevronRight } from "lucide-react"
import { PAGE_SURVEY_TAKE } from "../../lib/constants"

export default function PreviewSurveyBody({ id, numberOfQuestions } : { id: string, numberOfQuestions: number }) {

    return (
        <section className="w-full h-3/4 px-6 py-4 md:px-16 md:py-10 space-y-2 flex flex-col justify-end items-end border-b border-primary">
            <aside className="font-lato text-text flex flex-row items-center"><strong className="text-[1.75rem] mr-1">{numberOfQuestions}</strong> Questions</aside>
            <a href={`/${PAGE_SURVEY_TAKE}/${id}`} className="flex flex-row items-center font-roboto appButton text-xl"><p>Participate</p> <ChevronRight /></a>
        </section>
    )
}
