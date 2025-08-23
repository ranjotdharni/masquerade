import { useState, type MouseEvent } from "react"
import type { GenericError } from "../../lib/types/internal"
import { isValidEmail, isValidPassword } from "../../lib/utility/client"
import { API_BASIC_SIGNUP, PAGE_HOME } from "../../lib/constants"
import { useNavigate } from "react-router-dom"

type SignUpFormProps = {
    setError: (error: string) => void
    setLoader: (loader: boolean) => void
}

export default function SignUpForm({ setError, setLoader } : SignUpFormProps) {
    const navigate = useNavigate()

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirm, setConfirm] = useState<string>("")

    async function basicSignUp(event: MouseEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoader(true)

        const checkEmail: string = email.trim()
        const checkPassword: string = password.trim()
        const checkConfirm: string = confirm.trim()

        const invalidEmail: GenericError | undefined = isValidEmail(checkEmail)
        const invalidPassword: GenericError | undefined = isValidPassword(checkPassword, checkConfirm)

        if (invalidEmail !== undefined) {
            setError(invalidEmail.message || "Error")
        }
        else if (invalidPassword !== undefined) {
            setError(invalidPassword.message || "Error")
        }
        else {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${API_BASIC_SIGNUP}`, {
                method: "POST",
                body: JSON.stringify({
                    email: checkEmail,
                    password: checkPassword
                })
            }).then(middle => {
                return middle.json()
            }).then(result => {
                return result
            })

            if (response.error) {
                setError(response.message)
            }
            else {
                localStorage.setItem(import.meta.env.VITE_ACCESS_TOKEN_NAME, response[import.meta.env.VITE_ACCESS_TOKEN_NAME])
                navigate(`/${PAGE_HOME}`)
            }
        }

        setLoader(false)
    }

    return (
        <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-lato-bold text-text">
                Sign Up
            </h1>
            <div className="w-full flex-1 mt-8">
                <form onSubmit={basicSignUp} className="mx-auto max-w-xs">
                    <input
                        value={email}
                        onChange={e => { setEmail(e.target.value) }}
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 placeholder-gray-500 text-sm text-accent focus:text-text focus:outline-none focus:border focus:border-accent focus:bg-white"
                        type="email" placeholder="Email" />
                    <input
                        value={password}
                        onChange={e => { setPassword(e.target.value) }}
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 placeholder-gray-500 text-sm text-accent focus:text-text focus:outline-none focus:border focus:border-accent focus:bg-white mt-5"
                        type="password" placeholder="Password" />
                    <input
                        value={confirm}
                        onChange={e => { setConfirm(e.target.value) }}
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 placeholder-gray-500 text-sm text-accent focus:text-text focus:outline-none focus:border focus:border-accent focus:bg-white mt-5"
                        type="password" placeholder="Confirm Password" />
                    <button
                        type="submit"
                        className="mt-5 tracking-wide font-semibold bg-text text-accent w-full py-4 rounded-lg hover:text-white hover:bg-primary hover:cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                        
                        <span className="ml-3 font-jbm">
                            Sign Up
                        </span>
                    </button>
                </form>
            </div>
        </div>
    )
}
