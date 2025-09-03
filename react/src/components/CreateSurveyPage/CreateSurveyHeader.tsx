import { Plus } from "lucide-react"
import ToggleButton from "../utility/animated/ToggleButton"

type CreateSurveyHeaderProps = {
    name: string
    changeName: (name: string) => void
    addQuestion: () => void
}

export default function CreateSurveyHeader({ name, changeName, addQuestion } : CreateSurveyHeaderProps) {

    return (
        <header className="w-full h-[10%] md:h-[5%] p-2 border-t border-accent bg-primary flex flex-col md:flex-row justify-between items-end">
            <div className="w-full h-1/2 md:w-1/4 md:h-full">
                <input value={name} onChange={e => { changeName(e.target.value) }} placeholder="Enter Survey Name..." className="w-full h-full appInput" />
            </div>
            <div className="h-1/2 pt-2 md:h-auto md:pt-0 px-2 gap-2 flex flex-row items-center font-jbm text-xs text-inactive">
                <div className="px-2 h-full flex flex-row justify-start items-center space-x-6">
                    <button onClick={addQuestion} className="px-2 h-full flex flex-row items-center rounded bg-secondary text-xs text-background hover:cursor-pointer hover:bg-text">
                        <Plus className="h-full w-auto aspect-square py-1" />
                        <p className="font-lato">Add Question</p>
                    </button>
                    <div className="flex flex-row items-center space-x-2">
                        <p>Invite Only</p>
                        <ToggleButton style={{width: "4em"}} />
                    </div>
                </div>
            </div>
        </header>
    )
}
