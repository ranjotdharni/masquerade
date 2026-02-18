import { Check, Plus } from "lucide-react"
import ToggleButton from "../utility/animated/ToggleButton"
import type { MouseEvent } from "react"

type CreateSurveyHeaderProps = {
    name: string
    changeName: (name: string) => void
    addQuestion: () => void
    setInviteOnly: (isInviteOnly: boolean) => void
    submit: (event: MouseEvent<HTMLButtonElement>) => void
}

export default function CreateSurveyHeader({ name, changeName, addQuestion, setInviteOnly, submit } : CreateSurveyHeaderProps) {

    return (
        <header className="w-[80vw] md:w-[88vw] h-[12vh] md:h-[4vh] left-[17vw] md:left-[11vw] top-[1.5vh] relative md:px-2 bg-primary flex flex-col md:flex-row justify-evenly md:justify-between items-center rounded">
            <div className="h-2/5 w-full md:w-1/4 md:h-full px-2 md:px-0 flex flex-row items-center">
                <input value={name} onChange={e => { changeName(e.target.value) }} placeholder="Enter Survey Name..." className="w-full h-1/2 text-sm appInput" />
            </div>
            <div className="h-3/5 md:h-3/4 w-full md:w-auto md:px-2 md:gap-2 flex flex-row items-center font-jbm text-xs text-inactive">
                <div className="w-full md:w-auto px-2 h-full flex flex-col md:flex-row justify-between md:justify-start items-center space-x-2 md:space-x-6">
                    <div className="w-full md:w-auto h-[3/5] md:h-full flex justify-evenly flex-row md:space-x-1">
                        <button onClick={addQuestion} className="md:py-0 md:px-6 md:aspect-auto h-full w-[45%] md:w-auto flex flex-row justify-center items-center rounded bg-text text-xs text-background hover:cursor-pointer hover:text-primary dark:hover:text-secondary">
                            <Plus className="flex h-full aspect-square md:px-0 py-1" />
                            <p className="flex font-lato">Add Question</p>
                        </button>
                        <button onClick={submit} className="md:py-0 md:px-6 md:aspect-auto h-full w-[45%] md:w-auto flex flex-row justify-center items-center rounded bg-text text-xs text-background hover:cursor-pointer hover:text-primary dark:hover:text-secondary">
                            <Check className="flex h-full aspect-square md:px-0 py-1" />
                            <p className="flex font-lato">Create</p>
                        </button>
                    </div>
                    <div className="w-full md:w-auto h-2/5 md:h-full flex flex-row justify-end md:justify-evenly items-center space-x-2">
                        <p>Invite Only</p>
                        <ToggleButton className="w-6 md:w-8" onActivated={() => {setInviteOnly(true)}} onDeactivated={() => {setInviteOnly(false)}} />
                    </div>
                </div>
            </div>
        </header>
    )
}
