import { API_SURVEY_CREATE } from "../../constants"
import type { SurveyCreationSlug } from "../../types/client"
import type { GenericError, GenericSuccess } from "../../types/internal"
import { authenticatedRequest } from "../internal"

export async function createSurvey(slug: SurveyCreationSlug): Promise<GenericSuccess | GenericError> {
    const result: GenericSuccess | GenericError = await authenticatedRequest(API_SURVEY_CREATE, "POST", slug).then(response => {
        if (response.error)
            return response as GenericError

        return { success: true } as GenericSuccess
    })

    return result
}
