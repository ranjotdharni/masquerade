import { APP_NAME, ICON_LOGO, PAGE_WELCOME } from "../../lib/constants"

export default function BaseHeader() {
    return (
        <header className="absolute top-0 w-full h-[10vh] p-4 md:pr-10 flex flex-row justify-between items-center bg-primary">
            <a href={PAGE_WELCOME} className="h-full flex flex-row items-center space-x-2">
                <img className="h-full aspect-square" src={ICON_LOGO} alt='Logo' />
                <h1 className="text-xl md:text-3xl text-text font-jbm-bold">{APP_NAME}</h1>
            </a>
        </header>
    )
}
