import type { Survey } from "../../lib/types/api"
import StatsBody from "./coordinator/StatsBody"
import StatsHeader from "./coordinator/StatsHeader"

export default function PageCoordinator({ content } : { content: Survey }) {

    return (
        <>
            <StatsHeader name={content.name} inviteOnly={content.inviteOnly} />
            <StatsBody survey={content} />
        </>
    )
}
