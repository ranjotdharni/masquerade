import { useState, type CSSProperties, type MouseEvent } from "react"

type ToggleButtonProps = {
    onActivated?: () => void
    onDeactivated?: () => void
    style?: CSSProperties
    className?: string
}

export default function ToggleButton({ style, className, onActivated, onDeactivated } : ToggleButtonProps) {
    const [activated, setActivated] = useState<boolean>(false)

    function toggle(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault()

        setActivated(prev => {
            if (prev)
                (onDeactivated ? onDeactivated() : undefined)
            else
                (onActivated ? onActivated() : undefined)

            return !prev
        })
    }

    return (
        <button onClick={toggle} style={{backgroundColor: (activated ? "var(--color-success)" : "var(--color-inactive)"), borderColor: (activated ? "var(--color-success)" : "var(--color-inactive)"), transition: "background 0.33s ease, border 0.33s ease", ...style}} className={`rounded-[1000px] aspect-[2] border flex justify-start flex-row items-center hover:cursor-pointer ${className}`}>
            <div style={{transform: `translateX(${activated ? '100%' : '0%'})`, transition: "transform 0.33s ease"}} className="h-full aspect-square bg-background dark:bg-accent rounded-[1000px]"></div>
        </button>
    )
}
