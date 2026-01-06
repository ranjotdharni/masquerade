import { LockOpen, Lock, ChevronRight, Plus } from "lucide-react"
import type { SurveyMetadata } from "../../lib/types/api"
import { PAGE_SURVEY_CREATE, PAGE_SURVEY_TAKE, PAGE_SURVEY_VIEW } from "../../lib/constants"
import { NAV_CSS } from "../utility/animated/NavBar"

function SurveyWidget({ survey } : { survey: SurveyMetadata }) {

    return (
        <li className="w-full md:relative md:w-[99%] md:left-[1%] h-30 px-2 pt-1 pb-3 mt-2 flex flex-col justify-between rounded border border-accent">
            <div className="w-full flex flex-row justify-between">
                <h3 className="font-lato-italic text-lg md:text-[1.5rem] text-primary">{survey.name}</h3> 
                <p className="text-text flex flex-row items-center after:content-['Questions'] after:text-xs after:ml-1">{survey.numberOfQuestions}</p>
            </div>

            <div className="pl-1 flex flex-row justify-between">
                {
                    survey.inviteOnly ? 
                    <Lock className="text-error" strokeWidth={2.5} /> :
                    <LockOpen className="text-inactive" opacity={0.25} strokeWidth={2.5} />
                }
                
                <div className="flex flex-row">
                    <a href={`/${PAGE_SURVEY_VIEW}/${survey._id.$oid}`} className="flex flex-row items-center text-inactive scale-75 hover:cursor-pointer hover:text-text">
                        <p className="font-jbm-italic">View</p>
                        <ChevronRight />
                    </a>
                    <a href={`/${PAGE_SURVEY_TAKE}/${survey._id.$oid}`} className="font-lato appButton">Participate</a>
                </div>
            </div>
        </li>
    )
}

export default function MySurveyList({ surveys } : { surveys: SurveyMetadata[] }) {
    let baseStyle: Record<string | number | symbol, string | undefined> = surveys.length === 0 ? {display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"} : {} 

    return (
        <ul style={baseStyle} className={`h-full border-t border-text overflow-y-scroll overflow-x-hidden px-4 pb-4 ${NAV_CSS.md_pl}`}>
            {
                surveys.length === 0 ?
                <a href={`/${PAGE_SURVEY_CREATE}`} className="appButton font-jbm flex flex-row"><Plus className="mr-2" /> Create</a> : 
                surveys.map(s => {
                    return <SurveyWidget key={s._id.$oid} survey={s} />
                })
            }
        </ul>
    )
}
