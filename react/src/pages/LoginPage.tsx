import { ICON_LOGO_STICKER, PAGE_HOME } from "../lib/constants"
import LoginPageImage from "../assets/svg/loginPageImage.svg"
import { useNavigate, useSearchParams } from "react-router-dom"
import SignInForm from "../components/LoginPage/SignInForm"
import { useState } from "react"
import SignUpForm from "../components/LoginPage/SignUpForm"
import useError from "../lib/hooks/useError"

export default function LoginPage() {
    let navigate = useNavigate()
    
    const [searchParams, setSearchParams] = useSearchParams()
    let errorResponse: string | null = searchParams.get("error")
    let accessToken: string | null = searchParams.get("access")
    let refreshToken: string | null = searchParams.get("refresh")

    const [error, setError] = useError()
    const [signUp, setSignUp] = useState<boolean>(false)

    if (errorResponse) {
        handleServerError(errorResponse)
    }
    else if (accessToken && refreshToken) {
        handleTokens(accessToken, refreshToken)
    }

    function handleServerError(errorResponse: string) {
        alert(`Error: ${errorResponse}`)
    }

    function handleTokens(accessToken: string, refreshToken: string) {
        alert(`Access Token: ${accessToken}\nRefresh Token: ${refreshToken}`)
        // Add logic here to store tokens properly
        navigate(`/${PAGE_HOME}`)
    }

    return (
        <section className="mt-[10vh] w-full h-[85vh] bg-background flex justify-center">
            <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    <div className="h-12">
                        <img src={ICON_LOGO_STICKER} className="h-full mx-auto" />
                    </div>

                    { signUp ? <SignUpForm setError={setError} /> : <SignInForm setError={setError} /> }

                    <p className="mt-6 mx-auto text-xs text-gray-600 text-center">
                        { signUp ? "Already have an account?" : "Don't have an account?" } <button onClick={() => { setError(""); setSignUp(prev => !prev) }} className="hover:underline hover:cursor-pointer text-primary">Sign { signUp ? "In" : "Up" }.</button>
                    </p>

                    { error.trim() !== "" ? <p className="mt-2 mx-auto text-xs text-error text-center">{error}</p> : <></> }
                </div>
                <div className="flex-1 bg-text text-center hidden lg:flex">
                    <img className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat" src={LoginPageImage} />
                </div>
            </div>
        </section>
    )
}
