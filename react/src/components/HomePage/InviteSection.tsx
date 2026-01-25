import { ChevronRight, Trash2 } from "lucide-react"
import { API_INVITE_DECLINE, API_INVITE_RECEIVED, DEFAULT_ERROR_MESSAGE, PAGE_SURVEY_PREVIEW, PAGE_SURVEY_TAKE } from "../../lib/constants"
import type { SurveyMetadata } from "../../lib/types/api"
import { useContext, useEffect, useState, type MouseEvent } from "react"
import Loader from "../utility/Loader"
import { authenticatedRequest } from "../../lib/utility/internal"
import { UIContext } from "../context/UIContext"

type InviteResult = {
    survey: string
    metadata: SurveyMetadata
}

function InviteCard({ metadata, notify, remove } : { metadata: SurveyMetadata, notify: (message: string, error: boolean) => void, remove: (id: string) => void }) {
    const { confirm } = useContext(UIContext)

    async function decline() {
        await authenticatedRequest(API_INVITE_DECLINE, "POST", { id: metadata._id.$oid }).then(result => {
            let message = result.message as string || DEFAULT_ERROR_MESSAGE

            if (result.error) {
                notify(message, true)
            }
            else {
                notify(message, false)
                remove(metadata._id.$oid)
            }
        })
    }

    async function onDecline(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        confirm({
            message: "After declining, you may not participate in this survey unless you are sent another invite. Would you still like to continue?",
            callback: decline,
            loaderText: "Declining Invite..."
        })
    }

    return (
        <li className="w-full h-50 bg-background flex flex-col justify-center items-center">
            <div className="flex flex-col border-text border-2 rounded-lg w-full h-full overflow-hidden">
                <span className="w-full flex flex-row justify-start bg-text text-background text-sm font-jbm p-2">
                    <h2>{metadata.name}</h2>
                </span>

                <span className="w-full flex flex-row justify-end items-center text-text font-jbm p-2">
                    <h3>{`${metadata.numberOfQuestions} Question(s)`}</h3>
                </span>

                <span className="px-3 text-xs flex flex-1 flex-row justify-end items-end font-lato">
                    <a href={`/${PAGE_SURVEY_PREVIEW}/${metadata._id.$oid}`} className="flex flex-row items-center text-inactive hover:cursor-pointer hover:text-text">
                        <p className="font-jbm-italic">View</p>
                        <ChevronRight />
                    </a>
                </span>

                <div className="p-4 flex flex-row justify-between items-center">
                    <button onClick={onDecline} className="flex flex-row items-center font-jbm text-xs pr-2 py-[2px] space-x-2 hover:cursor-pointer text-error border-2 hover:text-background hover:bg-error border-error p-[1px] rounded">
                        <Trash2 className="scale-75" />
                        <p>Decline</p>
                    </button>
                    <a href={`/${PAGE_SURVEY_TAKE}/${metadata._id.$oid}`} className="font-lato appButton">Participate</a>
                </div>
            </div>
        </li>
    )
}

export default function InviteSection() {
    const { notify } = useContext(UIContext)

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [invites, setInvites] = useState<SurveyMetadata[]>([])

    function convertToComponents(invites: SurveyMetadata[]) {
        return (
            invites.length === 0 ?

            <li className="flex flex-row justify-center items-center h-full w-full font-jbm text-inactive">You currently have no invites.</li> : 

            invites.map(invite => {
                return <InviteCard key={invite._id.$oid} metadata={invite} notify={simpleNotify} remove={remove} />
            })
        )
    }

    function simpleNotify(message: string, error: boolean) {
        notify({ message: message, color: error ? "var(--color-error)" : "var(--color-text)" })
    }

    function remove(id: string) {
        const newArray = [...invites]
        const removeIndex = newArray.findIndex(i => i._id.$oid === id)

        if (removeIndex > -1) {
            newArray.splice(removeIndex, 1)
            setInvites(newArray)
        }
    }

    useEffect(() => {
        async function getInvites() {
            setIsLoading(true)

            await authenticatedRequest(API_INVITE_RECEIVED, "GET").then(result => {
                let message = result.message as string || DEFAULT_ERROR_MESSAGE

                if (result.error) {
                    notify({
                        message: message,
                        color: "var(--color-error)"
                    })
                }
                else {
                    console.log(result)
                    setInvites((result as { success: true, content: InviteResult[] }).content.map(i => i.metadata))
                }
            })

            setIsLoading(false)
        }

        getInvites()
    }, [])

    return (
        <div className="w-full h-[85vh] md:w-1/2 md:h-full md:pr-4 flex flex-col items-center md:items-end">
            <h2 className="w-full md:w-4/5 h-[7.5%] px-4 rounded-t-xl flex flex-row justify-end items-center bg-text font-jbm text-lg text-background">Invites</h2>
            <ul style={{overflowY: isLoading || invites.length === 0 ? undefined : "scroll"}} className="w-full md:w-4/5 h-[90%] bg-background border-2 border-text p-4 space-y-4 md:shadow-xl">
                {
                    isLoading 
                    ?
                    <div className="flex flex-col space-y-2 justify-center items-center h-full w-full">
                        <div className="w-10 md:mr-4 aspect-square">
                            <Loader />
                        </div>
                        <p className="text-sm font-jbm text-text">Retrieving Invites...</p>
                    </div> 
                    :
                    convertToComponents(invites)
                }
            </ul>
        </div>
    )
}
