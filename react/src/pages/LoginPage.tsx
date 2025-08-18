import { ICON_LOGO_STICKER, PAGE_HOME } from "../lib/constants"
import LoginPageImage from "../assets/svg/loginPageImage.svg"
import { useNavigate, useSearchParams } from "react-router-dom"
import SignInForm from "../components/LoginPage/SignInForm"
import { useEffect, useState } from "react"
import SignUpForm from "../components/LoginPage/SignUpForm"
import useError from "../lib/hooks/useError"
import Loader from "../components/utility/Loader"

export default function LoginPage() {
    let navigate = useNavigate()
    
    const [searchParams, setSearchParams] = useSearchParams()
    let errorResponse: string | null = searchParams.get("error")

    const hash = window.location.hash.substring(1)
    const hashParams = new URLSearchParams(hash)
    let accessToken: string | null = hashParams.get(import.meta.env.VITE_ACCESS_TOKEN_NAME)

    const [loader, setLoader] = useState<boolean>(false)
    const [error, setError] = useError()
    const [signUp, setSignUp] = useState<boolean>(false)

    function handleServerError(errorResponse: string) {
        alert(`Error: ${errorResponse}`)
    }

    function handleTokens(accessToken: string) {
        localStorage.setItem(import.meta.env.VITE_ACCESS_TOKEN_NAME, accessToken)
        navigate(`/${PAGE_HOME}`)
    }

    useEffect(() => {
        if (errorResponse) {
            handleServerError(errorResponse)
        }
        else if (accessToken) {
            setLoader(true)
            handleTokens(accessToken)
        }
    }, [errorResponse, accessToken])

    return (
        <section className="mt-[10vh] w-full h-[85vh] bg-background flex justify-center">
            <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    <div className="h-12">
                        <img src={ICON_LOGO_STICKER} className="h-full mx-auto" />
                    </div>

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

                    <p className="mt-6 mx-auto text-xs text-gray-600 text-center">
                        { signUp ? "Already have an account?" : "Don't have an account?" } <button disabled={loader} onClick={() => { setError(""); setSignUp(prev => !prev) }} className="hover:underline hover:cursor-pointer text-primary">Sign { signUp ? "In" : "Up" }.</button>
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
