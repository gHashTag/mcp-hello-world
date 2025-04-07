import readline from 'readline';
import { developmentHandler } from '../bot/handlers/development.js';
import { Context } from '../bot/types.js';
import { WebSocket } from 'ws';

// Добавляем WebSocket в глобальную область видимости
(global as any).WebSocket = WebSocket;

// Устанавливаем переменные окружения для MCP
process.env.MCP_SERVER_URL = 'ws://localhost:8888';
process.env.MCP_API_KEY = 'test-api-key';

// Создаем интерфейс для чтения ввода пользователя
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Эмулируем контекст Telegram бота
const createMockContext = (text: string): Context => ({
  message: text,
  reply: async (text: string) => {
    console.log('\n🤖 Бот:', text);
  }
});

console.log('🚀 Запуск тестового чата с ботом...');
console.log('❗️ Для выхода введите "exit" или нажмите Ctrl+C');
console.log('📝 Введите сообщение для бота:');

// Основной цикл чата
const chat = async () => {
  try {
    for await (const line of rl) {
      if (line.toLowerCase() === 'exit') {
        console.log('👋 До свидания!');
        rl.close();
        process.exit(0);
      }

      console.log('\n👤 Вы:', line);
      
      // Создаем контекст и обрабатываем сообщение
      const ctx = createMockContext(line);
      await developmentHandler(ctx);

      console.log('\n📝 Введите следующее сообщение:');
    }
  } catch (error) {
    console.error('❌ Ошибка:', error);
    rl.close();
    process.exit(1);
  }
};

// Запускаем чат
chat(); 