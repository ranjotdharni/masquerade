import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SurveyHeader({ name, length, index, cycleForward, cycleBackward } : { name: string, length: number, index: number, cycleForward: () => void, cycleBackward: () => void }) {

    return (
        <header className="w-full h-[4vh] top-[1.5vh] flex flex-row justify-between items-center">
            <h1 className="font-jbm text-lg text-text border-2 border-text rounded px-2">
                {name}
            </h1>
            
            <div className="h-full flex flex-row items-center">
                <button onClick={cycleBackward} className="h-full p-2">
                    <ChevronLeft className="w-full h-full border-2 rounded text-text border-text hover:bg-text hover:text-background hover:cursor-pointer" />
                </button>
                <p className="font-jbm text-inactive px-2">{`${index + 1} / ${length}`}</p>
                <button onClick={cycleForward} className="h-full p-2">
                    <ChevronRight className="w-full h-full border-2 rounded text-text border-text hover:bg-text hover:text-background hover:cursor-pointer" />
                </button>
            </div>
        </header>
    )
}
