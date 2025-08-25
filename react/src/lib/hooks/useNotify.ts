import { useEffect, useState } from "react"

export const NOTIFY_TIMEOUT_MS: number = 8000

export default function useNotify(initial?: string): [string, (message: string) => void] {
    const [message, setMessage] = useState<string>(initial ? initial : "")

    useEffect(() => {
        let timeoutId: number | undefined

        function startTimeout(): number | undefined {
            if (timeoutId)                  // previous timeout still active, clear first
                clearTimeout(timeoutId)

            return setTimeout(()=> {    // after ${NOTIFY_TIMEOUT_MS} milliseconds, clear this timeout and clear message
                timeoutId = undefined
                setMessage('')
            }, NOTIFY_TIMEOUT_MS)
        }

        function stopTimeout() {
            if (timeoutId)
                clearTimeout(timeoutId)
        }

        if (message.trim() !== "")
            timeoutId = startTimeout()

        return stopTimeout  // stop any remaining timeout on component dismount
    }, [message])

    return [message, setMessage]
}