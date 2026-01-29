import { NAV_CSS } from "../../utility/animated/NavBar"
import { Lock, LockOpen } from "lucide-react"

export default function StatsHeader({ name, inviteOnly } : { name: string, inviteOnly: boolean }) {

    return (
        <header style={{width: `calc(100% - ${NAV_CSS.getX()})`}} className={`px-4 pt-2 ${NAV_CSS.h} ${NAV_CSS.md_ml}`}>
            <div className="w-full h-full rounded bg-accent flex flex-row justify-between items-center pl-2 pr-4">
                <h1 className="text-text font-jbm-bold">Statistics: <span className="font-jbm-italic">{name}</span></h1>
                {
                    inviteOnly ?
                    <Lock className="text-error ml-1" /> : 
                    <LockOpen className="text-inactive ml-1" />
                }
            </div>
        </header>
    )
}
