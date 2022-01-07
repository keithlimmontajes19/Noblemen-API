export const RESPONSE = (status, message, data, code = 100) => {
    return {
        status,
        code,
        message,
        data,
    }
}
