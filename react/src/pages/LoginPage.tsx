import { AUTH_ID_LIST, DEFAULT_ERROR_MESSAGE, DUPLICATE_USER_CODE, ICON_LOGO_STICKER, PAGE_HOME } from "../lib/constants"
import LoginPageImage from "../assets/svg/loginPageImage.svg"
import { useNavigate, useSearchParams } from "react-router-dom"
import SignInForm from "../components/LoginPage/SignInForm"
import { useEffect, useState } from "react"
import SignUpForm from "../components/LoginPage/SignUpForm"
import useNotify from "../lib/hooks/useNotify"
import Loader from "../components/utility/Loader"

export default function LoginPage() {
    let navigate = useNavigate()
    
    const [searchParams] = useSearchParams()

    const [loader, setLoader] = useState<boolean>(false)
    const [error, setError] = useNotify()
    const [signUp, setSignUp] = useState<boolean>(false)

    function handleServerError(error: string) {
        const duplicateError: number = Number(error)

        if (isNaN(duplicateError)) {
            setError(DEFAULT_ERROR_MESSAGE)
            return
        }

        if (duplicateError === DUPLICATE_USER_CODE) {
            const providerResponse: string | null = searchParams.get("provider")

            if (!providerResponse) {
                setError(DEFAULT_ERROR_MESSAGE)
                return
            }

            const provider: number = Number(providerResponse)

            if (isNaN(provider) || !AUTH_ID_LIST[provider]) {
                setError(DEFAULT_ERROR_MESSAGE)
                return
            }

            setError(`Sign in with ${AUTH_ID_LIST[provider]}`)
            return
        }
    }

    function handleTokens(accessToken: string) {
        localStorage.setItem(import.meta.env.VITE_ACCESS_TOKEN_NAME, accessToken)
        navigate(`/${PAGE_HOME}`)
    }

    useEffect(() => {
        let errorResponse: string | null = searchParams.get("error")

        if (errorResponse) {
            handleServerError(errorResponse)
            return
        }

        const hash = window.location.hash.substring(1)
        window.history.replaceState(null, "", window.location.pathname) // wipe credentials from browser history

        const hashParams = new URLSearchParams(hash)
        let accessToken: string | null = hashParams.get(import.meta.env.VITE_ACCESS_TOKEN_NAME)
        
        if (accessToken) {
            setLoader(true)
            handleTokens(accessToken)
        }
    }, [])

    useEffect(() => {
        // send user immediately to home page if they're already authenticated, further auth checking will be enacted by Auth Context
        async function performAuthCheck() {
            const existingRefreshToken: string | null = localStorage.getItem(import.meta.env.VITE_REFRESH_TOKEN_NAME)

            if (existingRefreshToken)
                navigate(`/${PAGE_HOME}`)
        }

        if (import.meta.env.VITE_CONFIRM_AUTH === "true")
            performAuthCheck()
    }, [])

    return (
        <section className="w-full h-[85vh] bg-background flex justify-center">
            <article className="max-w-screen-xl m-0 sm:m-10 bg-white dark:bg-primary shadow sm:rounded-lg flex justify-center items-center md:items-stretch flex-1">
                <div className="lg:w-1/2 xl:w-5/12 px-6 flex flex-col justify-evenly">
                    <header className="h-12">
                        <img src={ICON_LOGO_STICKER} className="h-full mx-auto" />
                    </header>

                    { 
                        loader
                        ?
                        <div className="mt-12 py-60 flex flex-col justify-center items-center">
                            <div className="w-8 h-12 relative bottom-6">
                                <Loader />
                            </div>
                        </div>
                        :
                        signUp ? <SignUpForm setError={setError} setLoader={setLoader} /> : <SignInForm setError={setError} setLoader={setLoader} /> 
                    }

                    <aside className="z-10 relative mt-6 mx-auto text-xs text-gray-600 dark:text-text text-center">
                        { signUp ? "Already have an account?" : "Don't have an account?" } <button disabled={loader} onClick={() => { setError(""); setSignUp(prev => !prev) }} className="hover:underline hover:cursor-pointer text-primary dark:text-accent dark:hover:text-secondary">Sign { signUp ? "In" : "Up" }.</button>
                    </aside>

                    { error.trim() !== "" ? <p className="mt-2 mx-auto text-xs text-error text-center">{error}</p> : <></> }
                </div>

                <figure className="flex-1 bg-text text-center hidden lg:flex h-full">
                    <img className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat" src={LoginPageImage} />
                </figure>
            </article>
        </section>
    )
}
