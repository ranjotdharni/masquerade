import { useState} from "react"
import { NAV_CSS } from "../../utility/animated/NavBar"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { QUESTION_TYPE_ID_MAP } from "../../../lib/constants"
import SingleChoiceStatView from "../viewer/SingleChoiceStatView"
import MultipleChoiceStatView from "../viewer/MultipleChoiceStatView"
import RankingStatView from "../viewer/RankingStatView"
import RatingStatView from "../viewer/RatingStatView"
import type { MultipleChoiceQuestion, RankingQuestion, RatingQuestion, SingleChoiceQuestion, Survey } from "../../../lib/types/api"

export default function StatsBody({ survey } : { survey: Survey }) {
    const [questionIndex, setQuestionIndex] = useState<number>(0)

    function cycleBackward() {
        let dec = questionIndex - 1
        setQuestionIndex(dec > -1 ? dec : survey.questions.length - 1)
    }

    function cycleForward() {
        let inc = questionIndex + 1
        setQuestionIndex(inc > survey.questions.length - 1 ? 0 : inc)
    }

    function DetermineView(index: number) {
        let subject = survey.questions[index]

        switch (subject.type) {
            case QUESTION_TYPE_ID_MAP.SINGLE_CHOICE_TYPE:
                return <SingleChoiceStatView question={subject as SingleChoiceQuestion} surveySubmissions={survey.submissions!} />
            case QUESTION_TYPE_ID_MAP.MULTIPLE_CHOICE_TYPE:
                return <MultipleChoiceStatView question={subject as MultipleChoiceQuestion} surveySubmissions={survey.submissions!} />
            case QUESTION_TYPE_ID_MAP.RANKING_TYPE:
                return <RankingStatView question={subject as RankingQuestion} surveySubmissions={survey.submissions!} />
            case QUESTION_TYPE_ID_MAP.RATING_TYPE:
                return <RatingStatView question={subject as RatingQuestion} surveySubmissions={survey.submissions!} />
        }
    }

    return (
        <section className={`mt-2 md:mt-0 w-full ${NAV_CSS.md_h_diff} ${NAV_CSS.md_px}`}>
            <header className="w-full md:h-[10%] flex flex-col md:flex-row justify-between items-end md:items-center px-2">
                <h2 className="mt-6 md:mt-0 mr-2 md:mr-0 p-1 text-text font-jbm border-2 border-text rounded">Survey Submissions: <span className="font-jbm-bold">{survey.submissions}</span></h2>

                <div className="w-full md:w-auto flex flex-row justify-between md:justify-center items-center">
                    <button onClick={cycleBackward} className="p-2">
                        <ChevronLeft className="w-full h-full border-2 rounded text-text border-text hover:bg-text hover:text-background hover:cursor-pointer" />
                    </button>
                    <h2 className="font-jbm text-inactive px-2">{`${questionIndex + 1} / ${survey.questions.length}`}</h2>
                    <button onClick={cycleForward} className="p-2">
                        <ChevronRight className="w-full h-full border-2 rounded text-text border-text hover:bg-text hover:text-background hover:cursor-pointer" />
                    </button>
                </div>
            </header>

            <article className="w-full md:h-[90%] px-2">
                {
                    DetermineView(questionIndex)
                }
            </article>
        </section>
    )
}
