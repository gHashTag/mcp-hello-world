import { MCPClient } from '@modelcontextprotocol/sdk';
import { BotConfig, MCPService } from '../types';

export class MCPServiceImpl implements MCPService {
  private client: MCPClient | null = null;
  private config: BotConfig;

  constructor(config: BotConfig) {
    this.config = config;
  }

  async initialize(): Promise<void> {
    console.log('🚀 Initializing MCP service...');
    
    try {
      this.client = new MCPClient({
        serverUrl: this.config.mcpServerUrl,
        apiKey: this.config.mcpApiKey
      });

      await this.client.connect();
      console.log('✅ MCP service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize MCP service:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    console.log('🔄 Closing MCP service...');
    
    try {
      if (this.client) {
        await this.client.disconnect();
        this.client = null;
      }
      console.log('✅ MCP service closed successfully');
    } catch (error) {
      console.error('❌ Failed to close MCP service:', error);
      throw error;
    }
  }

  getClient(): MCPClient {
    if (!this.client) {
      throw new Error('MCP client is not initialized');
    }
    return this.client;
  }
} 