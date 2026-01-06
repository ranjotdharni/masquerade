
export default function MySurveyHeader({ username, numberOfSurveys } : { username: string, numberOfSurveys: number }) {

    return (
        <section className="w-full h-1/4 p-4">
            <div className="w-full h-full p-2 bg-accent rounded-lg">
                <h1 className="h-3/5 text-[2rem] text-text font-jbm-bold">Your Surveys</h1>
                <div className="w-full h-2/5 px-4 flex flex-col justify-center items-end">
                    <h2 className="text-[1.5rem] text-secondary">{numberOfSurveys}</h2>
                    <p className="font-lato-italic text-inactive">{username}</p>
                </div>
            </div>
        </section>
    )
}
