import { WebSocket } from 'ws';
import { createMcpService } from '../bot/services/mcp.js';
import { TestResult } from './types.js';

// Добавляем WebSocket в глобальную область видимости
(global as any).WebSocket = WebSocket;

const TEST_CONFIG = {
  serverUrl: process.env.MCP_SERVER_URL || 'ws://localhost:8888',
  apiKey: process.env.MCP_API_KEY || 'test-api-key'
};

export const testMcpService = async (): Promise<TestResult> => {
  console.log('🚀 Запуск тестов MCP сервиса...');

  const results: TestResult = {
    name: 'MCP Service Tests',
    passed: true,
    errors: []
  };

  try {
    // Тест 1: Создание сервиса
    console.log('🎯 Тест 1: Создание MCP сервиса');
    const service = createMcpService(TEST_CONFIG);
    if (!service) {
      throw new Error('Не удалось создать MCP сервис');
    }
    console.log('✅ Сервис успешно создан');

    // Тест 2: Инициализация соединения
    console.log('🎯 Тест 2: Инициализация соединения');
    console.log('🚀 Connecting to MCP server...');
    await service.initialize();
    console.log('✅ Соединение успешно инициализировано');

    // Тест 3: Обработка задачи
    console.log('🎯 Тест 3: Обработка задачи');
    const result = await service.processTask('Тестовый промпт');
    if (!result) {
      throw new Error('Не удалось обработать задачу');
    }
    console.log('✅ Задача успешно обработана');

    // Тест 4: Закрытие соединения
    console.log('🎯 Тест 4: Закрытие соединения');
    await service.close();
    console.log('✅ Соединение успешно закрыто');

  } catch (error) {
    results.passed = false;
    results.errors.push(error instanceof Error ? error.message : 'Неизвестная ошибка');
    console.error('❌ Тест не пройден:', error);
  }

  console.log('🏁 Тесты MCP сервиса завершены');
  return results;
}; 