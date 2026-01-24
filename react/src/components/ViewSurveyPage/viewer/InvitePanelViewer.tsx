import { useState, type JSX } from "react"
import InfoModal from "../../utility/InfoModal"
import Loader from "../../utility/Loader"
import { NAV_CSS } from "../../utility/animated/NavBar"

export default function InvitePanelViewer({ inviteOnly } : { inviteOnly: boolean }) {
    const [isSending, setIsSending] = useState<boolean>(false)

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

    function Content() {
        return (
            <>
                <input placeholder="Enter email..." className="w-[90vw] md:w-1/5 text-sm px-2 font-jbm outline-none bg-inactive-light text-secondary focus:bg-accent focus:text-text rounded h-8" />
                <button className="md:w-auto appButton mr-2 font-lato">Send</button>
            </>
        )
    }

    function showRequiredComponent(): JSX.Element {
        if (isSending)
            return <InviteLoader />
        
        return inviteOnly ? <Content /> : <p className="text-lg font-jbm text-inactive mx-auto">This is a public survey.</p>
    }

    return (
        <section className="h-full w-full flex flex-col justify-center items-center">
            <header className="w-full h-[10%] p-4 flex flex-row justify-between items-center">
                <h2 className={`text-lg font-jbm-bold text-text px-4 border border-text ${NAV_CSS.md_ml}`}>Send an Invite</h2>
                <InfoModal classname={`infoModalInvitePrivacy w-6 before:p-2 before:w-[50vw] before:-left-[51vw] before:-left-0 md:before:w-[15vw] md:before:-left-[1250%] aspect-square hover:cursor-pointer`} />
            </header>

            <div className="w-full h-[90%] flex flex-col md:flex-row justify-center items-end md:items-center space-y-2 md:space-y-0 space-x-2 pr-[2.5vw] md:pr-0">
                { showRequiredComponent() }
            </div>
        </section>
    )
}
