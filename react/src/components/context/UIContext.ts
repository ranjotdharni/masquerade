import { createContext } from "react"
import type { UIContextValue } from "../../lib/types/context"

export const UIContext = createContext<UIContextValue>({
    notify: () => {},
    confirm: () => {},
})
