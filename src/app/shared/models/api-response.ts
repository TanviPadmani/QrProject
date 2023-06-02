import { EnumEntityType, EnumEntityEvents } from "./EntityInfo";

/**
 * Represent API error information 
 * **/
export class ApiError {
    entityCode?: EnumEntityType;
    eventCode?: EnumEntityEvents;
    statusCode?: number;
    statusText?: string;
    eventMessageId?: string
    errorMessage?: string;
    errorDetail?: string;
    url?: string;
}

export class ApiResponse {
    eventCode?: EnumEntityType;
    entityCode?: EnumEntityEvents;
    eventMessageId?: string;
}

export class ApiOkResponse<T> extends ApiResponse
{
    data?: T
}
export class ApiCreatedResponse<T> extends ApiOkResponse<T>
{
    location?: any
}