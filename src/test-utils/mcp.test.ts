import { createMcpService } from '../bot/services/mcp.js';
import { TestResult } from './types.js';

const TEST_CONFIG = {
  serverUrl: process.env.MCP_SERVER_URL || 'ws://localhost:3000',
  apiKey: process.env.MCP_API_KEY || 'test-api-key'
};

export const testMcpService = async (): Promise<TestResult> => {
  console.log('🚀 Starting MCP service tests...');

  const results: TestResult = {
    name: 'MCP Service Tests',
    passed: true,
    errors: []
  };

  try {
    // Тест 1: Создание сервиса
    console.log('🎯 Test 1: Creating MCP service');
    const service = createMcpService();
    if (!service) {
      throw new Error('Failed to create MCP service');
    }
    console.log('✅ Service created successfully');

    // Тест 2: Инициализация соединения
    console.log('🎯 Test 2: Initializing connection');
    process.env.MCP_SERVER_URL = TEST_CONFIG.serverUrl;
    process.env.MCP_API_KEY = TEST_CONFIG.apiKey;
    
    await service.initialize();
    console.log('✅ Connection initialized successfully');

    // Тест 3: Обработка задачи
    console.log('🎯 Test 3: Processing task');
    const result = await service.processTask('Test prompt');
    if (!result) {
      throw new Error('Failed to process task');
    }
    console.log('✅ Task processed successfully');

    // Тест 4: Закрытие соединения
    console.log('🎯 Test 4: Closing connection');
    await service.close();
    console.log('✅ Connection closed successfully');

  } catch (error) {
    results.passed = false;
    results.errors.push(error instanceof Error ? error.message : 'Unknown error');
    console.error('❌ Test failed:', error);
  }

  console.log('🏁 MCP service tests completed');
  return results;
}; 