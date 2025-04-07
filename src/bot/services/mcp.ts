import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { WebSocketClientTransport } from '@modelcontextprotocol/sdk/client/websocket.js';
import { Service } from '../types.js';

export class MCPService implements Service {
  private client: Client;

  constructor() {
    console.log('🚀 Initializing MCP service...');
    this.client = new Client({
      name: 'NeuroBlogger',
      version: '1.0.0'
    });
  }

  async initialize() {
    const serverUrl = process.env.MCP_SERVER_URL;
    const apiKey = process.env.MCP_API_KEY;

    if (!serverUrl || !apiKey) {
      throw new Error('🚫 MCP server URL or API key not set');
    }

    try {
      console.log('🚀 Connecting to MCP server...');
      
      const url = new URL(serverUrl);
      url.searchParams.set('token', apiKey);
      
      const transport = new WebSocketClientTransport(url);
      await this.client.connect(transport);

      console.log('✅ Connected to MCP server');
    } catch (error) {
      console.error('❌ Failed to connect to MCP server:', error);
      throw error;
    }
  }

  async close() {
    try {
      await this.client.close();
      console.log('✅ Closed MCP connection');
    } catch (error) {
      console.error('❌ Failed to close MCP connection:', error);
      throw error;
    }
  }

  async processTask(prompt: string) {
    try {
      console.log('🎯 Processing task with prompt:', prompt);
      
      const result = await this.client.complete({
        ref: {
          type: 'ref/prompt',
          name: 'default'
        },
        argument: {
          name: 'prompt',
          value: prompt
        }
      });

      console.log('✅ Task processed successfully');
      return result;
    } catch (error) {
      console.error('❌ Failed to process task:', error);
      throw error;
    }
  }

  getClient() {
    return this.client;
  }
} 