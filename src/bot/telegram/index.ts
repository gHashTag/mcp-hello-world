/**
 * Интеграция с Telegram для автономного агента
 * Реализовано в функциональном стиле
 */

import { Telegraf, Context } from 'telegraf';
import { createAgent, AgentConfig } from '../agent/index.js';
import { TaskType, TaskStatus } from '../agent/state.js';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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
      '🔧 /git - Операции с Git\n' +
      '🧠 /improve - Запрос на улучшение\n' +
      '🔄 /background - Запустить фоновое улучшение\n' +
      '📋 /check_tasks - Проверить статус фоновых задач\n\n' +
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
      '   🔧 /git - Операции с Git\n' +
      '   🧠 /improve - Запрос на улучшение\n' +
      '   🔄 /background - Запустить фоновое улучшение\n' +
      '   📋 /check_tasks - Проверить статус фоновых задач\n' +
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
  
  // Обработка команды /improve (самосовершенствование)
  bot.command('improve', async (ctx) => {
    if (!isAllowedUser(ctx, state)) {
      return ctx.reply('⛔ У вас нет доступа к этому боту.');
    }
    
    await ctx.reply('🧠 Опишите, чему мне нужно научиться или что улучшить в моей работе:');
  });
  
  // Обработка команды /background (фоновое улучшение)
  bot.command('background', async (ctx) => {
    if (!isAllowedUser(ctx, state)) {
      return ctx.reply('⛔ У вас нет доступа к этому боту.');
    }
    
    await ctx.reply('🔄 Опишите задачу фонового улучшения:');
  });
  
  // Обработка команды /check_tasks (проверка статуса фоновых задач)
  bot.command('check_tasks', async (ctx) => {
    if (!isAllowedUser(ctx, state)) {
      return ctx.reply('⛔ У вас нет доступа к этому боту.');
    }
    
    if (!state.initialized) {
      return ctx.reply('⚠️ Агент не инициализирован. Сначала запустите его, отправив какое-либо сообщение.');
    }
    
    try {
      // Получаем все фоновые задачи
      const allTasks = state.agent.getAllTasks();
      const backgroundTasks = allTasks.filter(task => 
        task.type === TaskType.BACKGROUND_IMPROVEMENT
      );
      
      if (backgroundTasks.length === 0) {
        await ctx.reply('📊 Нет активных фоновых задач.');
        return;
      }
      
      let statusMessage = '📊 Статус фоновых задач:\n\n';
      
      for (const task of backgroundTasks) {
        statusMessage += `ID: ${task.id}\n`;
        statusMessage += `Статус: ${task.status}\n`;
        statusMessage += `Создана: ${task.created.toLocaleString()}\n`;
        statusMessage += `Задача: ${task.description.substring(0, 50)}${task.description.length > 50 ? '...' : ''}\n`;
        
        if (task.status === TaskStatus.COMPLETED && task.result) {
          const createdFiles = task.result.createdFiles || [];
          if (createdFiles.length > 0) {
            statusMessage += `\nСозданные файлы:\n`;
            createdFiles.forEach((file: string) => {
              statusMessage += `- ${file}\n`;
            });
          }
          
          const updatedFiles = task.result.updatedFiles || [];
          if (updatedFiles.length > 0) {
            statusMessage += `\nОбновленные файлы:\n`;
            updatedFiles.forEach((file: string) => {
              statusMessage += `- ${file}\n`;
            });
          }
        }
        
        statusMessage += '\n-----------------\n\n';
      }
      
      await ctx.reply(statusMessage);
    } catch (error) {
      console.error('Error checking tasks:', error);
      await ctx.reply(`❌ Ошибка при проверке задач: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
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
        
        // Ключевые слова для распознавания различных типов запросов
        const selfImprovementKeywords = [
          'научись', 'улучши себя', 'стань лучше', 'совершенствуйся', 
          'развивайся', 'обучись', 'изучи', 'добавь функцию',
          'обнови', 'оптимизируй', 'улучши свой код'
        ];
        
        const backgroundKeywords = [
          'фоновый', 'фоном', 'заднем плане', 'фоновом',
          'фоновое', 'автоматическое улучшение'
        ];
        
        const isSelfImprovement = selfImprovementKeywords.some(keyword => 
          text.toLowerCase().includes(keyword.toLowerCase())
        );
        
        const isBackground = backgroundKeywords.some(keyword => 
          text.toLowerCase().includes(keyword.toLowerCase())
        );
        
        // Определяем тип задачи (для демонстрации используем CODE_GENERATION)
        let taskType = TaskType.CODE_GENERATION;
        
        // Инициализируем агента при необходимости
        if (!state.initialized) {
          await ctx.reply('🚀 Инициализация агента...');
          await state.agent.initialize();
          state.initialized = true;
        }
        
        if (isBackground) {
          try {
            await ctx.reply('🔄 Понял, вы хотите запустить фоновую задачу улучшения. Начинаю работу...');
            
            if (!state.initialized) {
              await ctx.reply('🚀 Инициализация агента...');
              await state.agent.initialize();
              state.initialized = true;
            }
            
            const backgroundTask = await state.agent.startBackgroundImprovement(
              text,
              ctx.from.id.toString()
            );
            
            await ctx.reply(
              `🔄 Запущена фоновая задача самосовершенствования (ID: ${backgroundTask.taskId})\n\n` +
              `Я буду работать над этим в фоновом режиме и сообщу о результатах. ` +
              `Вы можете проверить статус, используя команду /check_tasks.`
            );
            
            // Добавляем задачу в состояние бота для отслеживания
            state.tasks.set(backgroundTask.taskId, {
              userId: ctx.from.id,
              messageId: ctx.message.message_id
            });
          } catch (error) {
            console.error('Error starting background improvement:', error);
            await ctx.reply(`❌ Ошибка при запуске фонового самосовершенствования: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
          }
          return;
        } else if (isSelfImprovement) {
          // Если это запрос на самосовершенствование, но не фоновый, обрабатываем как обычную задачу
          await ctx.reply('🧠 Понял, вы хотите, чтобы я улучшил свои возможности. Работаю над этим...');
          taskType = TaskType.SELF_IMPROVEMENT;
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

  // Функция для периодической проверки завершенных задач
  const checkCompletedTasks = async () => {
    if (!state.initialized) {
      return;
    }
    
    try {
      // Получаем все фоновые задачи
      const allTasks = state.agent.getAllTasks();
      const backgroundTasks = allTasks.filter(task => 
        task.type === TaskType.BACKGROUND_IMPROVEMENT &&
        task.status === TaskStatus.COMPLETED &&
        !task.metadata.notificationSent // Флаг для отслеживания отправленных уведомлений
      );
      
      for (const task of backgroundTasks) {
        // Получаем информацию о задаче из состояния бота
        const taskInfo = state.tasks.get(task.id);
        
        if (taskInfo && taskInfo.userId) {
          try {
            // Отправляем уведомление пользователю
            await bot.telegram.sendMessage(
              taskInfo.userId,
              `✅ Фоновая задача завершена!\n\n` +
              `Задача: ${task.description}\n\n` +
              `Результаты:\n${JSON.stringify(task.result, null, 2)}`
            );
            
            // Отправляем уведомление администраторам, если это не сам администратор
            const adminUsers = process.env.ADMIN_USERS
              ? process.env.ADMIN_USERS.split(',').map(id => Number(id))
              : [];
            
            if (
              process.env.ADMIN_NOTIFICATION_ENABLED === 'true' && 
              adminUsers.length > 0 &&
              !adminUsers.includes(taskInfo.userId)
            ) {
              for (const adminId of adminUsers) {
                await bot.telegram.sendMessage(
                  adminId,
                  `🔔 Уведомление администратора:\n\n` +
                  `Пользователь ID: ${taskInfo.userId}\n` +
                  `Завершена фоновая задача: ${task.description}\n\n` +
                  `Результаты:\n${JSON.stringify(task.result, null, 2)}`
                );
              }
            }
            
            // Помечаем задачу как уведомленную
            task.metadata.notificationSent = true;
          } catch (error) {
            console.error(`Error sending notification for task ${task.id}:`, error);
          }
        }
      }
      
      // Очистка старых завершенных задач (старше 24 часов)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      const oldTasks = allTasks.filter(task => 
        task.status === TaskStatus.COMPLETED &&
        task.updated < oneDayAgo
      );
      
      for (const task of oldTasks) {
        // Удаляем информацию о задаче из состояния бота
        state.tasks.delete(task.id);
        console.log(`Cleaned up old task: ${task.id}`);
      }
    } catch (error) {
      console.error('Error checking completed tasks:', error);
    }
  };
  
  // Запускаем периодическую проверку каждые 30 секунд
  const taskCheckInterval = setInterval(checkCompletedTasks, 30000);
  
  // Останавливаем интервал при остановке бота
  bot.telegram.getMe().then(() => {
    console.log('Task completion check started');
    
    // Очищаем интервал при выключении бота
    process.once('SIGINT', () => {
      clearInterval(taskCheckInterval);
      console.log('Task completion check stopped');
    });
    
    process.once('SIGTERM', () => {
      clearInterval(taskCheckInterval);
      console.log('Task completion check stopped');
    });
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
    
    // Устанавливаем команды бота для отображения в меню
    await bot.telegram.setMyCommands([
      { command: 'start', description: 'Начать диалог' },
      { command: 'help', description: 'Получить помощь' },
      { command: 'analyze', description: 'Анализ кода' },
      { command: 'generate', description: 'Генерация кода' },
      { command: 'refactor', description: 'Рефакторинг кода' },
      { command: 'test', description: 'Генерация тестов' },
      { command: 'docs', description: 'Создание документации' },
      { command: 'deps', description: 'Управление зависимостями' },
      { command: 'git', description: 'Операции с Git' },
      { command: 'improve', description: 'Запрос на улучшение' },
      { command: 'background', description: 'Запустить фоновое улучшение' },
      { command: 'check_tasks', description: 'Проверить статус фоновых задач' },
      { command: 'status', description: 'Показать статус агента' }
    ]);
    console.log('✅ Команды бота установлены');
    
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