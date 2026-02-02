import { APP_NAME, PAGE_WELCOME } from "../../../lib/constants"

export default function InfoGraphicSection() {

    return (
        <section className="w-full mt-16">
            <header className="w-full flex flex-col items-center justify-center">
                <h3 className="text-[2rem] font-roboto-bold text-primary text-center">Keep Up With Your Users Through {APP_NAME}</h3>
                <a href={`${PAGE_WELCOME}`} className="mt-6 text-[1.25rem] font-roboto-bold text-text underline hover:cursor-pointer">How it works</a>
            </header>
        </section>
    )
}
