import type { SurveyMetadata } from "../../lib/types/api"

function SurveyWidget({ survey } : { survey: SurveyMetadata }) {

    return (
        <li>
           <h3>{survey.name}</h3> 
        </li>
    )
}

export default function MySurveyList({ surveys } : { surveys: SurveyMetadata[] }) {

    return (
        <ul className="border-t border-accent">
            {
                surveys.map(s => {
                    return <SurveyWidget key={s._id.$oid} survey={s} />
                })
            }
        </ul>
    )
}
