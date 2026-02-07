import { ChevronRight, Lock, LockOpen } from "lucide-react"
import { PAGE_SURVEY_PREVIEW, PAGE_SURVEY_TAKE } from "../../lib/constants"
import type { SurveyMetadata } from "../../lib/types/api"

type CatalogContent = {
    catalogContent: SurveyMetadata[]
}

type CardContent = {
    cardContent: SurveyMetadata
}

function CatalogCard({ cardContent } : CardContent) {
    return (
        <li className="h-[45vh] flex flex-col justify-center items-center">
            <div className="flex flex-col bg-background border-text dark:bg-primary border-2 rounded-lg w-3/4 h-3/4 overflow-hidden">
                <h2 className="w-full flex flex-row justify-start bg-text text-background text-xl font-jbm p-2">
                    <span>{cardContent["name"]}</span>
                </h2>

                <h3 className="w-full flex flex-row justify-end items-center text-text text-xl lg:text-3xl font-jbm p-2">
                    <span>{`${cardContent["numberOfQuestions"]} Question(s)`}</span>
                </h3>

                <div className="px-3 text-sm flex flex-1 flex-row justify-end items-end font-lato">
                    <a href={`/${PAGE_SURVEY_PREVIEW}/${cardContent["_id"]["$oid"]}`} className="flex flex-row items-center text-inactive hover:cursor-pointer hover:text-text dark:hover:text-secondary">
                        <p className="font-jbm-italic">View</p>
                        <ChevronRight />
                    </a>
                </div>

                <div className="p-4 flex flex-row justify-between items-center">
                    {
                        cardContent["inviteOnly"] ? 
                        <Lock className="text-error" strokeWidth={2.5} /> :
                        <LockOpen className="text-inactive" opacity={0.25} strokeWidth={2.5} />
                    }
                    <a href={`/${PAGE_SURVEY_TAKE}/${cardContent["_id"]["$oid"]}`} className="font-lato appButton dark:bg-text! dark:text-primary! dark:hover:text-secondary!">Participate</a>
                </div>
            </div>
        </li>
    )
}

export default function Catalog({ catalogContent } : CatalogContent) {
    return (
        <ul className="w-full h-full grid grid-cols-1 md:grid-cols-3 gap-4">
            {
                catalogContent.map(card => {
                    return (
                        <CatalogCard key={card["_id"]["$oid"]} cardContent={card} />
                    )
                })
            }
        </ul>
    )
}
