/**
 * Мок-сервер для тестирования MCP (Model Context Protocol) клиента
 * 
 * Сервер реализует базовый функционал MCP протокола:
 * 1. WebSocket соединение для обмена сообщениями
 * 2. HTTP эндпоинт /health для проверки состояния
 * 3. Обработка основных методов протокола:
 *    - initialize: начальная настройка соединения
 *    - completion/complete: обработка запросов на генерацию текста
 *    - notifications/initialized: подтверждение инициализации
 * 
 * Особенности реализации:
 * - Использует единый HTTP сервер для WebSocket и REST API
 * - Поддерживает JSON-RPC 2.0 формат сообщений
 * - Включает эмодзи в логах для улучшения читаемости
 * - Обрабатывает ошибки при парсинге сообщений
 * - Динамически находит свободный порт, если основной занят
 */

import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { createConnection } from 'net';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ 
  noServer: true,
  path: '/'
});

// Эндпоинт для проверки здоровья
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Обработка WebSocket соединений
wss.on('connection', (ws) => {
  console.log('🔌 Новое подключение');

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message);
      console.log('📩 Получено сообщение:', data);

      // Отправляем мок-ответ в зависимости от метода
      if (data.method === 'initialize') {
        // Ответ на инициализацию: отправляем версию протокола и информацию о сервере
        const response = {
          jsonrpc: '2.0',
          id: data.id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            serverInfo: {
              name: 'MockServer',
              version: '1.0.0'
            }
          }
        };
        ws.send(JSON.stringify(response));
      } else if (data.method === 'completion/complete') {
        // Ответ на запрос генерации: отправляем мок-ответ с текстом
        const response = {
          jsonrpc: '2.0',
          id: data.id,
          result: {
            completion: {
              values: ['Мок-ответ для промпта: ' + data.params.argument.value]
            }
          }
        };
        ws.send(JSON.stringify(response));
      } else if (data.method === 'notifications/initialized') {
        // Уведомление об инициализации не требует ответа
        return;
      } else {
        // Обработка неизвестных методов
        const response = {
          jsonrpc: '2.0',
          id: data.id,
          result: {
            status: 'success',
            data: 'Мок-ответ для: ' + data.method
          }
        };
        ws.send(JSON.stringify(response));
      }
    } catch (error) {
      console.error('❌ Ошибка обработки сообщения:', error);
    }
  });

  ws.on('close', () => {
    console.log('🔌 Соединение закрыто');
  });
});

// Обработка WebSocket upgrade запросов
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

/**
 * Функция для проверки доступности порта
 * @param port Номер порта для проверки
 * @returns Promise, который резолвится с true если порт свободен, иначе с false
 */
function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const tester = createConnection({ port, host: 'localhost' });
    
    tester.once('connect', () => {
      tester.end();
      resolve(false); // Порт занят
    });
    
    tester.once('error', (err) => {
      if ((err as any).code === 'ECONNREFUSED') {
        resolve(true); // Порт свободен
      } else {
        resolve(false); // Другая ошибка
      }
    });
  });
}

/**
 * Функция для поиска свободного порта
 * @param startPort Начальный порт для поиска
 * @param maxAttempts Максимальное количество попыток
 * @returns Promise с номером свободного порта
 */
async function findAvailablePort(startPort: number, maxAttempts: number = 10): Promise<number> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const port = startPort + attempt;
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`Не удалось найти свободный порт после ${maxAttempts} попыток`);
}

// Запуск сервера на свободном порту
const DEFAULT_PORT = parseInt(process.env.PORT || '8888', 10);

findAvailablePort(DEFAULT_PORT)
  .then(port => {
    server.listen(port, () => {
      console.log(`🚀 Мок-сервер запущен на порту ${port}`);
      
      // Экспортируем порт для использования в других модулях
      if (typeof process !== 'undefined' && process.env) {
        process.env.MOCK_SERVER_PORT = port.toString();
      }
    });
  })
  .catch(err => {
    console.error('❌ Не удалось запустить сервер:', err);
    process.exit(1);
  }); 