import { Plus } from "lucide-react"
import ToggleButton from "../utility/animated/ToggleButton"

type CreateSurveyHeaderProps = {
    name: string
    changeName: (name: string) => void
    addQuestion: () => void
}

export default function CreateSurveyHeader({ name, changeName, addQuestion } : CreateSurveyHeaderProps) {

    return (
        <header className="w-[80vw] md:w-[88vw] h-[4vh] md:h-[4vh] left-[17vw] md:left-[11vw] top-[1.5vh] relative p-2 bg-primary flex flex-row justify-between items-center md:items-end rounded">
            <div className="w-1/2 h-full md:w-1/4 md:h-full flex flex-row items-center">
                <input value={name} onChange={e => { changeName(e.target.value) }} placeholder="Enter Survey Name..." className="w-full h-full text-sm appInput" />
            </div>
            <div className="h-full md:h-auto md:px-2 md:gap-2 flex flex-row items-center font-jbm text-xs text-inactive">
                <div className="md:px-2 h-full flex flex-row justify-start items-center space-x-2 md:space-x-6">
                    <button onClick={addQuestion} className="md:p-2 md:py-0 md:px-2 aspect-square md:aspect-auto h-full flex flex-row items-center rounded bg-secondary text-xs text-background hover:cursor-pointer hover:bg-text">
                        <Plus className="flex h-full w-full md:aspect-square md:w-auto md:px-0 md:py-1" />
                        <p className="hidden md:flex font-lato">Add Question</p>
                    </button>
                    <div className="flex flex-row items-center space-x-1 md:space-x-2">
                        <p>Invite Only</p>
                        <ToggleButton className="w-6 md:w-8" />
                    </div>
                </div>
            </div>
        </header>
    )
}
