/**
 * Тестовый скрипт для автономного агента
 */

import { createAgent } from '../bot/agent/index.js';
import { TaskType } from '../bot/agent/state.js';
import readline from 'readline';

// Создание интерфейса для чтения из консоли
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Функция для запроса ввода
const prompt = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Вывод результата задачи
const displayTaskResult = (result: any) => {
  console.log('\n📋 Результат выполнения задачи:');
  console.log(JSON.stringify(result, null, 2));
  console.log('-----------------------------------');
};

// Основная функция теста
async function runAgentTest() {
  console.log('🤖 Запуск тестирования автономного агента...');
  console.log('❗️ Для выхода введите "exit" или нажмите Ctrl+C');
  
  // Создаем агента с настройками для локального тестирования
  const agent = createAgent({
    id: 'test-agent-' + Date.now(),
    mcpConfig: {
      serverUrl: 'ws://localhost:8888', // URL локального мок-сервера
      apiKey: 'test-key' // Тестовый API ключ
    }
  });
  
  // Инициализируем агента
  try {
    await agent.initialize();
    console.log('✅ Агент успешно инициализирован');
    
    let running = true;
    
    while (running) {
      console.log('\n📝 Выберите тип задачи:');
      console.log('1) Анализ кода');
      console.log('2) Генерация кода');
      console.log('3) Рефакторинг кода');
      console.log('4) Генерация тестов');
      console.log('5) Создание документации');
      console.log('6) Управление зависимостями');
      console.log('7) Операции с Git');
      console.log('exit) Выход');
      
      const choice = await prompt('Ваш выбор: ');
      
      if (choice.toLowerCase() === 'exit') {
        running = false;
        continue;
      }
      
      let taskType: TaskType;
      let taskDescription: string;
      let taskMetadata: Record<string, any> = {};
      
      switch (choice) {
        case '1': // Анализ кода
          taskType = TaskType.CODE_ANALYSIS;
          taskDescription = await prompt('Введите описание кода для анализа: ');
          break;
          
        case '2': // Генерация кода
          taskType = TaskType.CODE_GENERATION;
          taskDescription = await prompt('Введите требования к генерируемому коду: ');
          break;
          
        case '3': // Рефакторинг кода
          taskType = TaskType.CODE_REFACTORING;
          taskDescription = await prompt('Введите требования к рефакторингу: ');
          const sourceCode = await prompt('Введите исходный код для рефакторинга: ');
          taskMetadata.sourceCode = sourceCode;
          break;
          
        case '4': // Генерация тестов
          taskType = TaskType.TEST_GENERATION;
          taskDescription = await prompt('Введите требования к тестам: ');
          const codeForTests = await prompt('Введите код для тестирования: ');
          taskMetadata.sourceCode = codeForTests;
          break;
          
        case '5': // Создание документации
          taskType = TaskType.DOCUMENTATION;
          taskDescription = await prompt('Введите требования к документации: ');
          const documetationCode = await prompt('Введите код для документации (или оставьте пустым): ');
          if (documetationCode.trim()) {
            taskMetadata.sourceCode = documetationCode;
          }
          break;
          
        case '6': // Управление зависимостями
          taskType = TaskType.DEPENDENCY_MANAGEMENT;
          taskDescription = await prompt('Введите требования к зависимостям: ');
          const dependencyFile = await prompt('Введите содержимое файла зависимостей: ');
          taskMetadata.dependencyFile = { content: dependencyFile };
          break;
          
        case '7': // Операции с Git
          taskType = TaskType.GIT_OPERATIONS;
          taskDescription = await prompt('Введите задачу для Git: ');
          break;
          
        default:
          console.log('❌ Неизвестный тип задачи. Пожалуйста, выберите снова.');
          continue;
      }
      
      try {
        // Добавляем задачу
        const task = await agent.addTask(taskType, taskDescription, {
          priority: 1,
          metadata: taskMetadata
        });
        
        console.log(`✅ Задача ${task.id} добавлена успешно`);
        console.log('⏳ Ожидание выполнения задачи...');
        
        // В реальном приложении здесь должен быть механизм ожидания завершения задачи
        // Для демонстрации мы просто ждем некоторое время
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // В реальном приложении здесь будет получение результата задачи
        // Для демонстрации мы просто выводим заглушку
        displayTaskResult({
          status: 'Выполнено',
          taskId: task.id,
          taskType,
          description: taskDescription,
          result: 'Мок-результат выполнения задачи. В реальном приложении здесь будет результат от агента.'
        });
      } catch (error) {
        console.error('❌ Ошибка при выполнении задачи:', error);
      }
    }
    
  } catch (error) {
    console.error('❌ Ошибка инициализации агента:', error);
  } finally {
    // Завершаем работу агента
    try {
      await agent.shutdown();
      console.log('✅ Агент успешно завершил работу');
    } catch (shutdownError) {
      console.error('❌ Ошибка при завершении работы агента:', shutdownError);
    }
    
    // Закрываем интерфейс чтения
    rl.close();
  }
}

// Запускаем тест
runAgentTest().catch(error => {
  console.error('❌ Неперехваченная ошибка:', error);
  process.exit(1);
}); 