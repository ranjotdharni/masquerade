import ToggleButton from "../utility/animated/ToggleButton";

export default function CreateSurveyHeader() {

    return (
        <header className="w-full h-[10%] md:h-[5%] p-2 border-t border-accent bg-primary flex flex-col md:flex-row justify-between items-end">
            <div className="w-full h-1/2 md:w-1/4 md:h-full">
                <input placeholder="Enter Survey Name..." className="w-full h-full appInput" />
            </div>
            <div className="h-1/2 pt-2 md:h-auto md:pt-0 px-2 gap-2 flex flex-row items-center font-jbm text-xs text-inactive">
                <p>Invite Only</p>
                <div className="w-10 md:w-12 md:h-full flex flex-col justify-end">
                    <ToggleButton style={{width: "100%"}} />
                </div>
            </div>
        </header>
    )
}
