import { MCPClient } from '@modelcontextprotocol/sdk';
import { Service } from '../types';

export class MCPService implements Service {
  private client: MCPClient;

  constructor(serverUrl: string, apiKey: string) {
    this.client = new MCPClient({
      serverUrl,
      apiKey
    });
  }

  async initialize(): Promise<void> {
    console.log('🚀 Инициализация MCP сервиса...');
    try {
      await this.client.connect();
      console.log('✅ MCP сервис успешно инициализирован');
    } catch (error) {
      console.error('❌ Ошибка при инициализации MCP сервиса:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    console.log('🔄 Закрытие соединения с MCP сервисом...');
    try {
      await this.client.disconnect();
      console.log('✅ Соединение с MCP сервисом закрыто');
    } catch (error) {
      console.error('❌ Ошибка при закрытии соединения с MCP сервисом:', error);
      throw error;
    }
  }

  async processTask(task: any): Promise<void> {
    console.log('🚀 Обработка задачи через MCP:', task);
    try {
      await this.client.sendMessage(task);
      console.log('✅ Задача успешно обработана');
    } catch (error) {
      console.error('❌ Ошибка при обработке задачи:', error);
      throw error;
    }
  }

  getClient(): MCPClient {
    return this.client;
  }
} 