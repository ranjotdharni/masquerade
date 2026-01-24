import { ChevronRight, Trash2 } from "lucide-react"
import { PAGE_SURVEY_PREVIEW, PAGE_SURVEY_TAKE } from "../../lib/constants"
import type { SurveyMetadata } from "../../lib/types/api"
import { useState } from "react"
import Loader from "../utility/Loader"


function InviteCard({ metadata } : { metadata: SurveyMetadata }) {
    return (
        <li className="w-full h-50 bg-background flex flex-col justify-center items-center">
            <div className="flex flex-col border-text border-2 rounded-lg w-full h-full overflow-hidden">
                <span className="w-full flex flex-row justify-start bg-text text-background text-sm font-jbm p-2">
                    <h2>{metadata.name}</h2>
                </span>

                <span className="w-full flex flex-row justify-end items-center text-text font-jbm p-2">
                    <h3>{`${metadata.numberOfQuestions} Question(s)`}</h3>
                </span>

                <span className="px-3 text-xs flex flex-1 flex-row justify-end items-end font-lato">
                    <a href={`/${PAGE_SURVEY_PREVIEW}/${metadata._id.$oid}`} className="flex flex-row items-center text-inactive hover:cursor-pointer hover:text-text">
                        <p className="font-jbm-italic">View</p>
                        <ChevronRight />
                    </a>
                </span>

                <div className="p-4 flex flex-row justify-between items-center">
                    <button className="flex flex-row items-center font-jbm text-xs pr-2 py-[2px] space-x-2 hover:cursor-pointer text-error border-2 hover:text-background hover:bg-error border-error p-[1px] rounded">
                        <Trash2 className="scale-75" />
                        <p>Delete</p>
                    </button>
                    <a href={`/${PAGE_SURVEY_TAKE}/${metadata._id.$oid}`} className="font-lato appButton">Participate</a>
                </div>
            </div>
        </li>
    )
}

export default function InviteSection() {
    const [isLoading] = useState<boolean>(false)
    const [invites] = useState<SurveyMetadata[]>([])

    function convertToComponents(invites: SurveyMetadata[]) {
        return (
            invites.length === 0 ?

            <li className="flex flex-row justify-center items-center h-full w-full font-jbm text-inactive">You currently have no invites.</li> : 

            invites.map(invite => {
                return <InviteCard key={invite._id.$oid} metadata={invite} />
            })
        )
    }

    return (
        <div className="w-full h-[85vh] md:w-1/2 md:h-full md:pr-4 flex flex-col items-center md:items-end">
            <h2 className="w-full md:w-4/5 h-[7.5%] px-4 rounded-t-xl flex flex-row justify-end items-center bg-text font-jbm text-lg text-background">Invites</h2>
            <ul style={{overflowY: isLoading || invites.length === 0 ? undefined : "scroll"}} className="w-full md:w-4/5 h-[90%] bg-background border-2 border-text p-4 space-y-4 md:shadow-xl">
                {
                    isLoading 
                    ?
                    <div className="flex flex-col space-y-2 justify-center items-center h-full w-full">
                        <div className="w-10 md:mr-4 aspect-square">
                            <Loader />
                        </div>
                        <p className="text-sm font-jbm text-text">Retrieving Invites...</p>
                    </div> 
                    :
                    convertToComponents(invites)
                }
            </ul>
        </div>
    )
}
