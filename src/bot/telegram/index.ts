/**
 * Интеграция с Telegram для автономного агента
 * Реализовано в функциональном стиле
 */

import { Telegraf, Context } from 'telegraf';
import { createAgent, AgentConfig } from '../agent/index.js';
import { TaskType } from '../agent/state.js';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import WebSocket from 'ws';

// Добавляем WebSocket в глобальную область видимости для MCP SDK
(global as any).WebSocket = WebSocket;

// Загружаем переменные окружения
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../../');

config({ path: path.join(rootDir, '.env') });

// Типы для работы с Telegram
type TelegramTask = {
  userId: number;
  messageId: number;
};

// Состояние бота
type BotState = {
  agent: ReturnType<typeof createAgent>;
  allowedUsers: number[];
  tasks: Map<string, TelegramTask>;
  initialized: boolean;
};

/**
 * Создать начальное состояние бота
 */
const createBotState = (): BotState => {
  // Парсим список разрешенных пользователей
  const allowedUsers: number[] = process.env.ALLOWED_USERS
    ? process.env.ALLOWED_USERS.split(',').map(id => Number(id))
    : [];
  
  // Создаем экземпляр агента
  const agentConfig: AgentConfig = {
    id: process.env.AGENT_ID || 'telegram-agent',
    maxConcurrentTasks: Number(process.env.MAX_CONCURRENT_TASKS || 3),
    mcpConfig: {
      serverUrl: process.env.MCP_SERVER_URL || 'ws://localhost:8888',
      apiKey: process.env.MCP_API_KEY || 'test-key'
    }
  };
  
  return {
    agent: createAgent(agentConfig),
    allowedUsers,
    tasks: new Map<string, TelegramTask>(),
    initialized: false
  };
};

/**
 * Проверка, является ли пользователь разрешенным
 */
const isAllowedUser = (ctx: Context, state: BotState): boolean => {
  // Если список разрешенных пользователей пуст, разрешаем всем
  if (state.allowedUsers.length === 0) {
    return true;
  }
  
  // Проверяем, есть ли пользователь в списке разрешенных
  const userId = ctx.from?.id;
  return userId !== undefined && state.allowedUsers.includes(userId);
};

/**
 * Настройка обработчиков сообщений
 */
const setupHandlers = (bot: Telegraf<Context>, state: BotState): void => {
  // Обработка команды /start
  bot.start(async (ctx) => {
    if (!isAllowedUser(ctx, state)) {
      return ctx.reply('⛔ У вас нет доступа к этому боту.');
    }
    
    await ctx.reply(
      '👋 Привет! Я автономный агент-разработчик, который может помочь вам с различными задачами программирования.\n\n' +
      'Вот что я могу делать:\n' +
      '🔍 /analyze - Анализ кода\n' +
      '💻 /generate - Генерация кода\n' +
      '🔄 /refactor - Рефакторинг кода\n' +
      '🧪 /test - Генерация тестов\n' +
      '📝 /docs - Создание документации\n' +
      '📦 /deps - Управление зависимостями\n' +
      '🔧 /git - Операции с Git\n\n' +
      'Также вы можете просто отправить мне сообщение с описанием задачи!'
    );
  });
  
  // Обработка команды /help
  bot.help(async (ctx) => {
    if (!isAllowedUser(ctx, state)) {
      return ctx.reply('⛔ У вас нет доступа к этому боту.');
    }
    
    await ctx.reply(
      '🤖 Автономный агент-разработчик\n\n' +
      'Инструкции по использованию:\n\n' +
      '1. Используйте команды для конкретных типов задач:\n' +
      '   🔍 /analyze - Анализ кода\n' +
      '   💻 /generate - Генерация кода\n' +
      '   🔄 /refactor - Рефакторинг кода\n' +
      '   🧪 /test - Генерация тестов\n' +
      '   📝 /docs - Создание документации\n' +
      '   📦 /deps - Управление зависимостями\n' +
      '   🔧 /git - Операции с Git\n\n' +
      '2. После выбора команды, отправьте сообщение с деталями задачи\n' +
      '3. Дождитесь выполнения задачи и получения результата\n\n' +
      '🤔 Если у вас есть вопросы или предложения, пожалуйста, сообщите об этом.'
    );
  });
  
  // Обработка команды /status
  bot.command('status', async (ctx) => {
    if (!isAllowedUser(ctx, state)) {
      return ctx.reply('⛔ У вас нет доступа к этому боту.');
    }
    
    await ctx.reply('🔄 Статус агента: активен');
    // TODO: Добавить вывод информации о текущих задачах и статистике
  });
  
  // Обработка команды /analyze (анализ кода)
  bot.command('analyze', async (ctx) => {
    if (!isAllowedUser(ctx, state)) {
      return ctx.reply('⛔ У вас нет доступа к этому боту.');
    }
    
    await ctx.reply('🔍 Отправьте код для анализа:');
  });
  
  // Обработка команды /generate (генерация кода)
  bot.command('generate', async (ctx) => {
    if (!isAllowedUser(ctx, state)) {
      return ctx.reply('⛔ У вас нет доступа к этому боту.');
    }
    
    await ctx.reply('💻 Опишите, какой код нужно сгенерировать:');
  });
  
  // Обработка команды /refactor (рефакторинг кода)
  bot.command('refactor', async (ctx) => {
    if (!isAllowedUser(ctx, state)) {
      return ctx.reply('⛔ У вас нет доступа к этому боту.');
    }
    
    await ctx.reply('🔄 Отправьте код для рефакторинга и опишите, что нужно изменить:');
  });
  
  // Обработка обычных текстовых сообщений
  bot.on('text', async (ctx) => {
    if (!isAllowedUser(ctx, state)) {
      return ctx.reply('⛔ У вас нет доступа к этому боту.');
    }
    
    if ('text' in ctx.message) {
      const text = ctx.message.text;
      
      // Проверяем, не является ли сообщение командой
      if (text.startsWith('/')) {
        return;
      }
      
      try {
        // Отправляем сообщение о начале обработки
        const statusMessage = await ctx.reply('🤔 Обрабатываю ваш запрос...');
        
        // Определяем тип задачи (для демонстрации используем CODE_GENERATION)
        const taskType = TaskType.CODE_GENERATION;
        
        // Инициализируем агента при необходимости
        if (!state.initialized) {
          await ctx.reply('🚀 Инициализация агента...');
          await state.agent.initialize();
          state.initialized = true;
        }
        
        // Добавляем задачу
        const task = await state.agent.addTask(
          taskType,
          text,
          {
            priority: 1,
            metadata: {
              telegramUser: ctx.from?.id,
              messageId: ctx.message.message_id
            }
          }
        );
        
        // Сохраняем информацию о задаче
        if (ctx.from) {
          state.tasks.set(task.id, {
            userId: ctx.from.id,
            messageId: statusMessage.message_id
          });
        }
        
        // В реальном приложении здесь должен быть механизм ожидания завершения задачи
        // Для демонстрации мы просто ждем некоторое время
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Отправляем результат (демо-версия)
        if (ctx.chat?.id) {
          await ctx.telegram.editMessageText(
            ctx.chat.id,
            statusMessage.message_id,
            undefined,
            `✅ Задача выполнена!\n\nВаш запрос: "${text}"\n\nРезультат: В настоящее время я работаю в демо-режиме. В полной версии здесь будет результат выполнения вашей задачи.`
          );
        }
        
      } catch (error: unknown) {
        console.error('Error processing message:', error);
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        await ctx.reply(`❌ Произошла ошибка: ${errorMessage}`);
      }
    }
  });
  
  // Обработка ошибок
  bot.catch((err: unknown, ctx: Context) => {
    console.error(`Error for ${ctx.updateType}:`, err);
    ctx.reply('❌ Ой! Произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.');
  });
};

/**
 * Запуск бота
 */
const startBot = async (token: string): Promise<void> => {
  try {
    const bot = new Telegraf(token);
    const state = createBotState();
    
    // Настраиваем обработчики
    setupHandlers(bot, state);
    
    // Инициализируем агента
    await state.agent.initialize();
    state.initialized = true;
    console.log('✅ Агент успешно инициализирован');
    
    // Запускаем бота
    await bot.launch();
    console.log('🚀 Telegram бот запущен');
    
    // Обработка остановки
    const stopBot = async (): Promise<void> => {
      try {
        // Останавливаем бота
        bot.stop();
        console.log('🛑 Telegram бот остановлен');
        
        // Останавливаем агента
        await state.agent.shutdown();
        console.log('✅ Агент успешно завершил работу');
      } catch (error: unknown) {
        console.error('❌ Ошибка остановки:', error);
      }
    };
    
    process.once('SIGINT', stopBot);
    process.once('SIGTERM', stopBot);
    
  } catch (error: unknown) {
    console.error('❌ Ошибка запуска:', error);
    throw error;
  }
};

/**
 * Основная функция
 */
const main = async (): Promise<void> => {
  try {
    // Получаем токен бота из переменных окружения
    const token = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN не указан в .env файле');
    }
    
    await startBot(token);
  } catch (error: unknown) {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
  }
};

// Запускаем бота
main(); 