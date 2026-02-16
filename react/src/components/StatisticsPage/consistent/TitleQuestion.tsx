import { SURVEY_TYPE_TO_ICON } from "../../../lib/constants"
import type { QuestionIdType } from "../../../lib/types/client"

export default function TitleQuestion({ question, type } : { question: string, type: QuestionIdType }) {
    let classification = SURVEY_TYPE_TO_ICON[type]
    let Icon = classification.Icon
    return (
        <header className="w-full md:h-[10%] flex flex-col-reverse md:flex-row justify-between items-center">
            <h3 className="w-[90%] md:max-w-3/4 md:w-auto mt-2 md:mt-0 text-text font-jbm-bold p-2 border-2 bg-accent whitespace-pre-wrap wrap-break-word">{question}</h3>
            <div className="flex flex-row items-center space-x-2">
                <Icon className="text-text" />
                <p className="text-sm text-inactive font-jbm-italic">{classification.title}</p>
            </div>
        </header>
    )
}
