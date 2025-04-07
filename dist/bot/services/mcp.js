import { MCPClient } from '@modelcontextprotocol/sdk';
export class MCPServiceImpl {
    constructor(config) {
        this.client = null;
        this.config = config;
    }
    async initialize() {
        console.log('🚀 Initializing MCP service...');
        try {
            this.client = new MCPClient({
                serverUrl: this.config.mcpServerUrl,
                apiKey: this.config.mcpApiKey
            });
            await this.client.connect();
            console.log('✅ MCP service initialized successfully');
        }
        catch (error) {
            console.error('❌ Failed to initialize MCP service:', error);
            throw error;
        }
    }
    async close() {
        console.log('🔄 Closing MCP service...');
        try {
            if (this.client) {
                await this.client.disconnect();
                this.client = null;
            }
            console.log('✅ MCP service closed successfully');
        }
        catch (error) {
            console.error('❌ Failed to close MCP service:', error);
            throw error;
        }
    }
    getClient() {
        if (!this.client) {
            throw new Error('MCP client is not initialized');
        }
        return this.client;
    }
}
