import { Menu } from "lucide-react"
import { ICON_LOGO } from "../../lib/constants"

export default function AppHeader() {

    return (
        <header>
            <img src={ICON_LOGO} alt='Logo' />
            <h1>Masquerade</h1>

            <Menu />
        </header>
    )
}
