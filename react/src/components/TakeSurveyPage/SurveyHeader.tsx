import { ChevronLeft, ChevronRight } from "lucide-react"

export default function SurveyHeader({ name, length, index, cycleForward, cycleBackward } : { name: string, length: number, index: number, cycleForward: () => void, cycleBackward: () => void }) {

    return (
        <header className="w-[calc(100vw - 7vh)] ml-[7vh] md:ml-0 md:w-full md:h-[4vh] md:top-[1.5vh] flex flex-col items-end justify-evenly md:flex-row md:justify-between md:items-center">
            <h1 className="font-jbm mr-3 md:mr-0 md:text-lg text-text border-2 border-text rounded px-2">
                {name}
            </h1>
            
            <div className="h-full flex flex-row items-center mr-1 md:mr-0">
                <button onClick={cycleBackward} className="md:h-6 md:p-0 p-2">
                    <ChevronLeft className="w-full h-full border-2 rounded text-text border-text hover:bg-text hover:text-background hover:cursor-pointer" />
                </button>
                <p className="font-jbm text-inactive px-2">{`${index + 1} / ${length}`}</p>
                <button onClick={cycleForward} className="md:h-6 md:p-0 p-2">
                    <ChevronRight className="w-full h-full border-2 rounded text-text border-text hover:bg-text hover:text-background hover:cursor-pointer" />
                </button>
            </div>
        </header>
    )
}
