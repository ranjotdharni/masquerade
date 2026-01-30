import { APP_NAME, PAGE_LOGIN } from "../lib/constants"

export default function WelcomePage() {
    return (
        <section className="space-y-4 w-full left-0 top-[10vh] flex flex-col justify-center items-center">
            <h1 className="text-xl font-lato-bold">{`Welcome to ${APP_NAME}!`}</h1>
            <a href={PAGE_LOGIN} className="font-jbm text-sm appButton">Sign In</a>
        </section>
    )
}
