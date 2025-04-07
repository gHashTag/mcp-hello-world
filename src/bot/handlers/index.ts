import { Handler } from "../types.js"; import { developmentHandler } from "./development.js"; export const handlers: Record<string, Handler> = { development: developmentHandler };
