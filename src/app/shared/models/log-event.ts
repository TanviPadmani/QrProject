
export class SerializableException {
    type: string;
    message: string;
    helpLink: string;
    source: string;
    hResult: number;
    stackTrace: string;
    data: object[];
    innerException: SerializableException;
}
export class LogEvent {
    timestamp: string;
    message: string;
    exception: SerializableException;
    loggerName: string;
    level?: number;
    loggerLevel: string;
    userName: string;
}

export class LogEventList {
    messages: LogEvent[];
    from: number;
    size: number;
    totalRecords: number;
}