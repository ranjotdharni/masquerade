import { useState } from "react"
import type { Question } from "../../lib/types/api"
import QuestionViewer from "./viewer/QuestionViewer"
import { ChevronLeft, ChevronRight } from "lucide-react"

type ViewSurveyBodyProps = {
    questions: Question[]
}

export default function ViewSurveyBody({ questions } : ViewSurveyBodyProps) {
    const [index, setIndex] = useState<number>(0)

    function cycleForward() {
        setIndex(prev => {
            return (prev + 1 > questions.length - 1 ? 0 : prev + 1)
        })
    }

    function cycleBackward() {
        setIndex(prev => {
            return (prev - 1 < 0 ? questions.length - 1 : prev - 1)
        })
    }

    return (
        <section className="w-full h-3/4">
            <div className="h-[10%] w-full flex flex-row justify-end items-center pr-8">
                <button onClick={cycleBackward} className="p-2">
                    <ChevronLeft className="w-full h-full border-2 rounded text-text border-text hover:bg-text hover:text-background hover:cursor-pointer" />
                </button>
                <p className="font-jbm text-inactive px-2">{`${index + 1} / ${questions.length}`}</p>
                <button onClick={cycleForward} className="p-2">
                    <ChevronRight className="w-full h-full border-2 rounded text-text border-text hover:bg-text hover:text-background hover:cursor-pointer" />
                </button>
            </div>

            <QuestionViewer index={index} survey={questions} />
        </section>
    )
}
