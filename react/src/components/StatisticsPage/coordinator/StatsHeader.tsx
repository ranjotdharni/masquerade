import { NAV_CSS } from "../../utility/animated/NavBar"
import { Lock, LockOpen } from "lucide-react"

export default function StatsHeader({ name, inviteOnly } : { name: string, inviteOnly: boolean }) {

    return (
        <header className={`md:px-4 pt-2 w-[90%] ${NAV_CSS.mt} md:mt-0 ${NAV_CSS.md_w_diff} ${NAV_CSS.h} ${NAV_CSS.md_ml}`}>
            <div className="w-full md:h-full rounded bg-accent flex flex-row justify-between items-center py-2 md:py-0 pl-2 pr-4">
                <h1 className="max-w-4/5 md:max-w-auto text-text font-jbm-bold">Statistics: <span className="font-jbm-italic">{name}</span></h1>
                {
                    inviteOnly ?
                    <Lock className="text-error ml-1" /> : 
                    <LockOpen className="text-inactive ml-1" />
                }
            </div>
        </header>
    )
}
