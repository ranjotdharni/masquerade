import { useContext, useState, type JSX, type MouseEvent } from "react"
import InfoModal from "../../utility/InfoModal"
import Loader from "../../utility/Loader"
import { NAV_CSS } from "../../utility/animated/NavBar"
import { API_INVITE_SEND, DEFAULT_ERROR_MESSAGE } from "../../../lib/constants"
import { UIContext } from "../../context/UIContext"
import { authenticatedRequest } from "../../../lib/utility/internal"
import { AuthContext } from "../../context/AuthContext"

function Content({ recipient, editRecipient, send } : { recipient: string, editRecipient: (recipient: string) => void, send: (event: MouseEvent<HTMLButtonElement>) => void }) {
    return (
        <>
            <input placeholder="Enter email..." type="email" value={recipient} onChange={e => editRecipient(e.target.value)} className="w-[90vw] md:w-1/5 text-sm px-2 font-jbm outline-none bg-inactive-light text-secondary focus:bg-accent focus:text-text rounded h-8" />
            <button onClick={send} className="md:w-auto appButton mr-2 font-lato">Send</button>
        </>
    )
}

export default function InvitePanelViewer({ surveyId, inviteOnly } : { surveyId: string, inviteOnly: boolean }) {
    const authentication = useContext(AuthContext)
    const { notify } = useContext(UIContext)

    const [isSending, setIsSending] = useState<boolean>(false)
    const [recipient, setRecipient] = useState<string>("")

    function InviteLoader() {
        return (
            <div className="flex flex-col items-center mx-auto">
                <div className="w-10 md:mr-4 aspect-square">
                    <Loader />
                </div>
                <p className="text-sm font-jbm text-text">Sending...</p>
            </div>
        )
    }

    function showRequiredComponent(): JSX.Element {
        if (isSending)
            return <InviteLoader />
        
        return inviteOnly ? <Content recipient={recipient} editRecipient={editRecipient} send={send} /> : <p className="text-lg font-jbm text-inactive mx-auto">This is a public survey.</p>
    }

    function editRecipient(recipient: string) {
        setRecipient(recipient)
    }

    async function send(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        const validatedRecipient = recipient.trim()

        if (validatedRecipient === "") {
            notify({
                message: "Enter the recipient's email address.",
                color: "var(--color-error)"
            })
            return
        }

        setIsSending(true)

        await authenticatedRequest(authentication, API_INVITE_SEND, "POST", { id: surveyId, recipient: validatedRecipient }).then(result => {
            let message = result.message as string || DEFAULT_ERROR_MESSAGE

            if (result.error) {
                notify({
                    message: message,
                    color: "var(--color-error)"
                })
            }
            else {
                setRecipient("")
                notify({
                    message: message,
                    color: "var(--color-success)"
                })
            }
        })

        setIsSending(false)
    }

    return (
        <section className="h-full w-full flex flex-col justify-center items-center">
            <header className="w-full h-[10%] p-4 flex flex-row justify-between items-center">
                <h2 className={`text-lg font-jbm-bold text-text px-4 border border-text ${NAV_CSS.md_ml}`}>Send an Invite</h2>
                <InfoModal classname={`infoModalInvitePrivacy w-6 before:p-2 before:w-[50vw] before:-left-0 md:before:w-[15vw] md:before:-left-[1250%] aspect-square hover:cursor-pointer`} />
            </header>

            <div className="w-full h-[90%] flex flex-col md:flex-row justify-center items-end md:items-center space-y-2 md:space-y-0 space-x-2 pr-[2.5vw] md:pr-0">
                { showRequiredComponent() }
            </div>
        </section>
    )
}
