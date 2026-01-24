import { Info } from "lucide-react"
import type { CSSProperties } from "react"
import "../../css/utility.css"

export default function InfoModal({ style, classname } : { style?: CSSProperties, classname?: string }) {

    return (
        <p style={style} className={`infoModal text-inactive relative flex flex-col justify-center items-center before:border before:border-primary before:bg-background before:text-text before:font-jbm before:absolute before:text-xs before:z-10 ${classname}`}>
            <Info className="w-full h-full" />
        </p>
    )
}
