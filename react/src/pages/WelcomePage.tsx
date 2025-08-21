import { PAGE_LOGIN } from "../lib/constants"

export default function WelcomePage() {

    return (
        <section className="space-y-4 w-full h-[85vh] absolute left-0 top-[10vh] flex flex-col justify-center items-center">
            <h1 className="text-xl font-lato-bold">Welcome to Masquerade!</h1>
            <a href={PAGE_LOGIN} className="font-jbm text-sm appButton">Sign In</a>
        </section>
    )
}
