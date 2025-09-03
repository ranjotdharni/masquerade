import { PASSWORD_MIN_LENGTH, QUESTION_TYPE_ID_MAP } from "../constants"
import type { QuestionIdType } from "../types/client"
import type { GenericError } from "../types/internal"

export function isValidEmail(email: string): GenericError | undefined {
    const pattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!pattern.test(email)) {
        return {
            error: true,
            message: "Invalid Email Address",
        }
    }
}

export function isValidPassword(password: string, confirm: string): GenericError | undefined {
    const error: GenericError = { error: true }

    if (password !== confirm) {
        error.message = 'Passwords do not match.'
        return error
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
        error.message = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`
        return error
    }

    if (!/(?=.*[A-Z])/.test(password)) {
        error.message = 'Password requires a capital letter.'
        return error
    }

    if (!/(?=.*[0-9])/.test(password)) {
        error.message = 'Password requires a number.'
        return error
    }

    if (!/(?=.*[@#?!&])/.test(password)) {
        error.message = 'Password requires character @, #, ?, !, or &.'
        return error
    }
}

export function generateClientId(): string {
    const CLIENT_ID_LENGTH: number = 8
    return `${Math.floor(Math.random() * Math.pow(10, CLIENT_ID_LENGTH))}`
}

export function cycleQuestionType(type: QuestionIdType): QuestionIdType {
    const values = Object.values(QUESTION_TYPE_ID_MAP)
    const typeIndex = values.indexOf(type)

    if (typeIndex === -1 || typeIndex + 1 >= values.length)
        return values[0]
    
    return values[typeIndex + 1]
}
