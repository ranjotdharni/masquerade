import { useEffect, useState } from "react"

export default function useTimeout(initial?: number): [boolean, boolean, (milliseconds: number) => void, reset: () => void] {
    const [milliseconds, setMilliseconds] = useState<number>(initial ? initial : 0)
    const [started, setStarted] = useState<boolean>(false)
    const [complete, setComplete] = useState<boolean>(false)

    function beginTimeout(milliseconds: number): void {
        setStarted(true)
        setComplete(false)
        setMilliseconds(milliseconds)
    }

    function completeTimeout() {
        setStarted(false)
        setComplete(true)
    }

    function reset() {
        setStarted(false)
        setComplete(false)
    }

    useEffect(() => {
        let timeoutId: number | undefined

        function startTimeout(): number | undefined {
            if (timeoutId)                  // previous timeout still active, clear first
                clearTimeout(timeoutId)

            return setTimeout(()=> {    // after ${stopAt} milliseconds, clear this timeout
                timeoutId = undefined
                completeTimeout()
            }, milliseconds)
        }

        function stopTimeout() {
            if (timeoutId)
                clearTimeout(timeoutId)
        }

        if (milliseconds !== 0)
            timeoutId = startTimeout()

        return stopTimeout  // stop any remaining timeout on component dismount
    }, [milliseconds])

    return [started, complete, beginTimeout, reset]
}
