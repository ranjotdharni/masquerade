export type RecursiveObject<T> = T | T[] | RecursiveObject<T>[] | { [key: string | number | symbol]: RecursiveObject<T> }

export type GenericError = {
    error: true
    type?: string | number
    status?: number
    message?: string
}

export type GenericSuccess = {
    success: true
    type?: string | number
    status?: number
    message?: string
}
