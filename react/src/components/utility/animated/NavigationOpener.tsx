import "../../../css/animated.css"
type NavigationOpenerProps = {
    open: boolean
}

export default function NavigationOpener({ open } : NavigationOpenerProps) {
    let css: string = `navigationOpener ${ open ? 'navigationOpen' : 'navigationClosed' }`

    return (
        <div className={css}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    )
}
