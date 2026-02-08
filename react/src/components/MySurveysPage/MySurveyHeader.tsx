import { NAV_CSS } from "../utility/animated/NavBar"

export default function MySurveyHeader({ username, numberOfSurveys } : { username: string, numberOfSurveys: number }) {
    let containerCSS: string = `w-full h-1/4 p-4 pt-[1vh] ${NAV_CSS.pl}`

    return (
        <section className={containerCSS}>
            <div style={{position: "relative", width: "calc(100% - 0.5vh)", left: "0.5vh"}} className="w-full h-full p-2 bg-accent rounded-lg">
                <h1 className="h-3/5 text-[2rem] text-text font-jbm-bold">Your Surveys</h1>
                <div className="w-full h-2/5 px-4 flex flex-col justify-center items-end">
                    <p className="text-[1.5rem] text-text dark:text-primary flex flex-row items-center after:content-['Surveys'] after:text-sm after:ml-1">{numberOfSurveys}</p>
                    <p className="font-lato-italic text-inactive">{username}</p>
                </div>
            </div>
        </section>
    )
}
