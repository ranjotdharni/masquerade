
export default function MySurveyHeader({ username, numberOfSurveys } : { username: string, numberOfSurveys: number }) {

    return (
        <section className="w-full h-1/4 p-4">
            <div className="w-full h-full p-2 bg-accent rounded-lg">
                <h1 className="h-3/5 text-[2rem] text-text font-jbm-bold">Your Surveys</h1>
                <div className="w-full h-2/5 px-4 flex flex-col justify-center items-end">
                    <p className="text-[1.5rem] text-text flex flex-row items-center after:content-['Surveys'] after:text-sm after:ml-1">{numberOfSurveys}</p>
                    <p className="font-lato-italic text-inactive">{username}</p>
                </div>
            </div>
        </section>
    )
}
