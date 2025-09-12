import { useNavigate, useRouteError } from "react-router-dom"
import AppContent from "../layout/AppContent"
import AppFooter from "../layout/AppFooter"
import BaseHeader from "../layout/BaseHeader"
import { ICON_LOGO_STICKER, ICON_QUESTION_MARK, PAGE_HOME } from "../../lib/constants"

function ErrorContent({ error } : { error: any }) {
    const navigate = useNavigate()

    return (
        <article className="w-full h-full flex flex-col justify-center items-center space-y-2">
            <img className="relative left-8 rotate-15 scale-75" src={ICON_QUESTION_MARK} />
            <img className="rotate-15" src={ICON_LOGO_STICKER} />

            <p className="font-jbm-bold text-text text-xl text-center">
                {
                    error.status === 404 ? // Route not found
                    "Sorry, we couldn't find what you were looking for..." :
                    "Oops, something went wrong..."
                }
            </p>
            
            <div className="flex flex-row space-x-4">
                <a href={`/${PAGE_HOME}`} className="appButton font-lato">Home</a>
                <button onClick={() => {navigate(-1)}} className="appButton font-lato">Go Back</button>
            </div>
        </article>
    )
}

export default function ErrorView() {
    const error = useRouteError()

    return (
        <>
            <BaseHeader />

            <AppContent>
                <ErrorContent error={error} />
            </AppContent>

            <AppFooter />
        </>
    )
}
