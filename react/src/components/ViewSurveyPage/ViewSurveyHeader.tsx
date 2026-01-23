import { Lock, LockOpen } from "lucide-react"
import { NAV_CSS } from "../utility/animated/NavBar"

type ViewSurveyHeaderProps = {
    name: string
    inviteOnly: boolean
}

export default function ViewSurveyHeader({ name, inviteOnly } : ViewSurveyHeaderProps) {
    let containerCSS: string = `w-full h-[10%] p-4 pt-[1vh] ${NAV_CSS.pl}`
    
    return (
        <section className={containerCSS}>
            <div style={{position: "relative", width: "calc(100% - 0.5vh)", left: "0.5vh"}} className="w-full h-full p-2 md:pr-6 bg-accent rounded-lg flex flex-col items-end md:flex-row md:justify-between md:items-center">
                <h1 className="md:text-[2rem] text-text font-jbm-bold">{name}</h1>
                {
                    inviteOnly ?
                    <Lock className="text-error" /> : 
                    <LockOpen className="text-inactive" />
                }
            </div>
        </section>
    )
}
