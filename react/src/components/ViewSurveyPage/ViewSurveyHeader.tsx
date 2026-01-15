import { Lock, LockOpen } from "lucide-react"
import { NAV_CSS } from "../utility/animated/NavBar"

type ViewSurveyHeaderProps = {
    name: string
    inviteOnly: boolean
}

export default function ViewSurveyHeader({ name, inviteOnly } : ViewSurveyHeaderProps) {
    let containerCSS: string = `w-full h-1/4 p-4 pt-[1vh] ${NAV_CSS.pl}`
    
    return (
        <section className={containerCSS}>
            <div style={{position: "relative", width: "calc(100% - 0.5vh)", left: "0.5vh"}} className="w-full h-full p-2 bg-accent rounded-lg">
                <div className="h-3/4">
                    <h1 className="text-[2rem] text-text font-jbm-bold">{name}</h1>
                    {
                        inviteOnly ?
                        <Lock className="text-error ml-1" /> : 
                        <LockOpen className="text-inactive ml-1" />
                    }
                </div>
                <div className="w-full h-1/4 px-2 flex flex-row justify-end items-end space-x-2">
                    <button className="appButton w-26 px-0! py-0!">Statistics</button>
                    <button className="w-26 py-0 bg-error text-accent rounded hover:text-background hover:cursor-pointer">Delete</button>
                </div>
            </div>
        </section>
    )
}
