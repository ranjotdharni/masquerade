import { ChevronRight, Lock, LockOpen } from "lucide-react"
import type { RecursiveObject } from "../../lib/types/internal"
import { PAGE_SURVEY_PREVIEW, PAGE_SURVEY_TAKE } from "../../lib/constants"

type CatalogContent = {
    catalogContent: Record<string | number | symbol, RecursiveObject<string | number | boolean>>[]
}

type CardContent = {
    cardContent: Record<string | number | symbol, RecursiveObject<string | number | boolean>>
}

function CatalogCard({ cardContent } : CardContent) {
    return (
        <li className="h-[45vh] flex flex-col justify-center items-center">
            <div className="flex flex-col border-text border-2 rounded-lg w-3/4 h-3/4 overflow-hidden">
                <span className="w-full flex flex-row justify-start bg-text text-background text-xl font-jbm p-2">
                    <h2>{(cardContent as any)["name"]}</h2>
                </span>

                <span className="w-full flex flex-row justify-end items-center text-text text-xl lg:text-3xl font-jbm p-2">
                    <h3>{`${(cardContent as any)["numberOfQuestions"]} Question(s)`}</h3>
                </span>

                <span className="px-3 text-sm flex flex-1 flex-row justify-end items-end font-lato">
                    <a href={`/${PAGE_SURVEY_PREVIEW}/${(cardContent as any)["_id"]["$oid"]}`} className="flex flex-row items-center text-inactive hover:cursor-pointer hover:text-text">
                        <p className="font-jbm-italic">View</p>
                        <ChevronRight />
                    </a>
                </span>

                <div className="p-4 flex flex-row justify-between items-center">
                    {
                        (cardContent as any)["inviteOnly"] ? 
                        <Lock className="text-error" strokeWidth={2.5} /> :
                        <LockOpen className="text-inactive" opacity={0.25} strokeWidth={2.5} />
                    }
                    <a href={`/${PAGE_SURVEY_TAKE}/${(cardContent as any)["_id"]["$oid"]}`} className="font-lato appButton">Participate</a>
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
                        <CatalogCard key={(card as any)["_id"]["$oid"] as React.Key} cardContent={card} />
                    )
                })
            }
        </ul>
    )
}
