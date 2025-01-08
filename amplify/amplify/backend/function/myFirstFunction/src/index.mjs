import { createServer, proxy } from "aws-serverless-express";
import app from "./app.mjs"; // O app com a lógica da Lambda

/**
 * @type {import('http').Server}
 */
const server = createServer(app);

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export function handler(event, context) {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  return proxy(server, event, context, "PROMISE").promise;
}
