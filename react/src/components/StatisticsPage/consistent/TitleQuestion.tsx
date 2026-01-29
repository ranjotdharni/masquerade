
export default function TitleQuestion({ question } : { question: string }) {
    return (
        <header className="w-full h-[10%] flex flex-row justify-between items-center">
            <h3 className="md:max-w-3/4 text-text font-jbm-bold p-2 border border-2 bg-accent whitespace-pre-wrap wrap-break-word">{question}</h3>
            <p className="text-sm text-inactive font-jbm-italic">Hover over chart segments for details</p>
        </header>
    )
}
