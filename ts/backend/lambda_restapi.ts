import * as aws_lambda from 'aws-lambda';
import {app} from './app';
import * as serverless_http from 'serverless-http';

const lambda_adapter = serverless_http(app);

export async function handler(event:aws_lambda.APIGatewayProxyEvent, context: aws_lambda.Context) {
    return await lambda_adapter(event, context);
}
