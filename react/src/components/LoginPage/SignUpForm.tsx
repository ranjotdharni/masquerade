
type SignUpFormProps = {
    setError: (error: string) => void
    setLoader: (loader: boolean) => void
}

export default function SignUpForm({ setError, setLoader } : SignUpFormProps) {

    return (
        <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-lato-bold text-text">
                Sign Up
            </h1>
            <div className="w-full flex-1 mt-8">
                <div className="mx-auto max-w-xs">
                    <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 placeholder-gray-500 text-sm text-accent focus:text-text focus:outline-none focus:border focus:border-accent focus:bg-white"
                        type="email" placeholder="Email" />
                    <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 placeholder-gray-500 text-sm text-accent focus:text-text focus:outline-none focus:border focus:border-accent focus:bg-white mt-5"
                        type="password" placeholder="Password" />
                    <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 placeholder-gray-500 text-sm text-accent focus:text-text focus:outline-none focus:border focus:border-accent focus:bg-white mt-5"
                        type="password" placeholder="Confirm Password" />
                    <button
                        onClick={() => { setError("This is a sign up error.") }}
                        className="mt-5 tracking-wide font-semibold bg-text text-accent w-full py-4 rounded-lg hover:text-white hover:bg-primary hover:cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                        
                        <span className="ml-3 font-jbm">
                            Sign Up
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}
