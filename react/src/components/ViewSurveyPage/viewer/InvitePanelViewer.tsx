import InfoModal from "../../utility/InfoModal"

export default function InvitePanelViewer() {
    return (
        <section className="h-full w-full flex flex-col justify-center items-center">
            <header className="w-full h-[10%] p-4 flex flex-row justify-end items-center">
                <InfoModal classname={`infoModalInvitePrivacy w-6 before:p-2 before:w-[50vw] before:-left-[51vw] before:-left-0 md:before:w-[15vw] md:before:-left-[1250%] aspect-square hover:cursor-pointer`} />
            </header>

            <div className="w-full h-[90%]">

            </div>
        </section>
    )
}
