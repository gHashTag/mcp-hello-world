import { MCPClient } from '@modelcontextprotocol/sdk';
import { BotConfig, MCPService } from '../types';
export declare class MCPServiceImpl implements MCPService {
    private client;
    private config;
    constructor(config: BotConfig);
    initialize(): Promise<void>;
    close(): Promise<void>;
    getClient(): MCPClient;
}
