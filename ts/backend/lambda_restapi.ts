import * as framework from './framework';
import * as aws_lambda from 'aws-lambda';

export async function handler(event:aws_lambda.APIGatewayProxyEvent) {
    console.log(JSON.stringify(event, null, 2))
    return framework.jsonResponse({status: "ok"});
}
