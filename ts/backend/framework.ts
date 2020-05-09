export function jsonResponse(data:any) {
    const headers = {"Content-Type": "application/json"};
    return {statusCode: 200, headers, body: JSON.stringify(data)};
}
