interface LogPublisherConfig {
    loggerName: string;
    loggerLocation: string;
    isActive: boolean;
}
export const publishers: LogPublisherConfig[] = [
    {
        "loggerName": "console",
        "loggerLocation": "",
        "isActive": true
    },
    {
        "loggerName": "localstorage",
        "loggerLocation": "logging",
        "isActive": false
    },
    {
        "loggerName": "webapi",
        "loggerLocation": "/api/log", //Add Api Endpoint
        "isActive": false
    }
]
