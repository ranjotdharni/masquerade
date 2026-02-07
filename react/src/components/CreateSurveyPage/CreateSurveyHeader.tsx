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
        <header className="w-[80vw] md:w-[88vw] h-[4vh] md:h-[4vh] left-[17vw] md:left-[11vw] top-[1.5vh] relative p-2 bg-primary flex flex-row justify-between items-center md:items-end rounded">
            <div className="w-1/2 h-full md:w-1/4 md:h-full flex flex-row items-center">
                <input value={name} onChange={e => { changeName(e.target.value) }} placeholder="Enter Survey Name..." className="w-full h-full text-sm appInput" />
            </div>
            <div className="h-full md:h-auto md:px-2 md:gap-2 flex flex-row items-center font-jbm text-xs text-inactive">
                <div className="md:px-2 h-full flex flex-row justify-start items-center space-x-2 md:space-x-6">
                    <div className="flex flex-row space-x-1">
                        <button onClick={addQuestion} className="md:py-0 md:px-2 aspect-square md:aspect-auto h-5 md:h-auto flex flex-row items-center rounded bg-text text-xs text-background hover:cursor-pointer hover:text-primary dark:hover:text-secondary">
                            <Plus className="flex h-full w-full md:aspect-square md:w-auto md:px-0 md:py-1" />
                            <p className="hidden md:flex font-lato">Add Question</p>
                        </button>
                        <button onClick={submit} className="md:py-0 md:px-2 aspect-square md:aspect-auto h-5 md:h-auto flex flex-row items-center rounded bg-text text-xs text-background hover:cursor-pointer hover:text-primary dark:hover:text-secondary">
                            <Check className="flex h-full w-full md:aspect-square md:w-auto md:px-0 md:py-1" />
                            <p className="hidden md:flex font-lato">Create</p>
                        </button>
                    </div>
                    <div className="flex flex-row items-center space-x-1 md:space-x-2">
                        <p>Invite Only</p>
                        <ToggleButton className="w-6 md:w-8" onActivated={() => {setInviteOnly(true)}} onDeactivated={() => {setInviteOnly(false)}} />
                    </div>
                </div>
            </div>
        </header>
    )
}
