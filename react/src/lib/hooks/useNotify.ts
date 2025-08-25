import { useEffect, useState } from "react"
import useTimeout from "./useTimeout"

export const NOTIFY_TIMEOUT_MS: number = 8000

export default function useNotify(initial?: string): [string, (message: string) => void] {
    const [message, setMessage] = useState<string>(initial ? initial : "")
    const { completed, begin, reset } = useTimeout()

    useEffect(() => {
        if (message.trim() !== "")
            begin(NOTIFY_TIMEOUT_MS)

        if (completed) {
            reset()
            setMessage('')
        }
    }, [message, completed])

    return [message, setMessage]
}