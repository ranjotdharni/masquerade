import { APP_NAME, ICON_LOGO_STICKER } from "../../lib/constants"
import Loader from "./Loader"

export default function FullScreenLoader({ loaderText, width, height, aspectRatio } : { loaderText?: string, width?: string | number, height?: string | number, aspectRatio?: string | number }) {
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center space-y-4" style={{width: width, height: height, aspectRatio: aspectRatio}}>
            <img src={ICON_LOGO_STICKER} className="w-16 aspect-square bounceDelay" />
            <div className="w-10 aspect-square">
                <Loader />
            </div>
            <p className="text-text font-jbm pulse">{ loaderText ? loaderText : `${APP_NAME} is Loading...`}</p>
        </div>
    )
}
