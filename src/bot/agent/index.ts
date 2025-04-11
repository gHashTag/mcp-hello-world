/**
 * Автономный агент-разработчик
 * Интегрирует все компоненты системы
 */

import {
  AgentState,
  Task,
  TaskType,
  TaskStatus,
  createAgentState,
  addTask as addTaskToState,
  updateTaskStatus as updateTaskStatusInState,
  getAllTasks as getAllTasksFromState
} from './state.js';
import { TaskScheduler, TaskHandler, createTaskScheduler } from './scheduler.js';
import { createMcpService } from '../services/mcp.js';
import { Service } from '../types.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Интерфейс для конфигурации агента
export interface AgentConfig {
  id: string;
  maxConcurrentTasks?: number;
  mcpConfig?: {
    serverUrl: string;
    apiKey: string;
  };
}

// Главный класс автономного агента
export class AutonomousAgent {
  private state: AgentState;
  private scheduler: TaskScheduler;
  private mcpService: Service;
  private initialized: boolean = false;

  constructor(config: AgentConfig) {
    this.state = createAgentState(config.id);
    this.scheduler = createTaskScheduler(this.state, {
      maxConcurrentTasks: config.maxConcurrentTasks,
    });
    this.mcpService = createMcpService(config.mcpConfig);
  }

  // Инициализация агента
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    console.log(`Initializing agent ${this.state.id}...`);

    // Инициализируем MCP сервис
    await this.mcpService.initialize();

    // Регистрируем обработчики задач
    this.registerTaskHandlers();

    // Запускаем планировщик
    await this.scheduler.start();

    this.initialized = true;
    console.log(`Agent ${this.state.id} initialized successfully`);
  }

  // Остановка агента
  async shutdown(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    console.log(`Shutting down agent ${this.state.id}...`);

    // Останавливаем планировщик
    await this.scheduler.stop();

    // Закрываем соединение с MCP
    await this.mcpService.close();

    this.initialized = false;
    console.log(`Agent ${this.state.id} shut down successfully`);
  }

  // Добавление новой задачи
  async addTask(
    type: TaskType,
    description: string,
    options: {
      priority?: number;
      dependencies?: string[];
      metadata?: Record<string, any>;
    } = {}
  ): Promise<Task> {
    if (!this.initialized) {
      throw new Error('Agent not initialized');
    }

    const task = addTaskToState(this.state, {
      type,
      description,
      priority: options.priority || 1,
      dependencies: options.dependencies || [],
      metadata: options.metadata || {},
    });

    console.log(`Added task ${task.id} of type ${type}: ${description}`);
    return task;
  }

  // Регистрация обработчиков задач
  private registerTaskHandlers(): void {
    // Регистрируем обработчик для анализа кода
    this.scheduler.registerHandler(new CodeAnalysisHandler(this.mcpService));
    
    // Регистрируем обработчик для генерации кода
    this.scheduler.registerHandler(new CodeGenerationHandler(this.mcpService));
    
    // Регистрируем обработчик для рефакторинга кода
    this.scheduler.registerHandler(new CodeRefactoringHandler(this.mcpService));
    
    // Регистрируем обработчик для генерации тестов
    this.scheduler.registerHandler(new TestGenerationHandler(this.mcpService));
    
    // Регистрируем обработчик для документации
    this.scheduler.registerHandler(new DocumentationHandler(this.mcpService));
    
    // Регистрируем обработчик для управления зависимостями
    this.scheduler.registerHandler(new DependencyManagementHandler(this.mcpService));
    
    // Регистрируем обработчик для операций с Git
    this.scheduler.registerHandler(new GitOperationsHandler(this.mcpService));
  }

  /**
   * Запуск задачи самосовершенствования в фоновом режиме
   * @param description Описание задачи
   * @param userId ID пользователя
   * @returns Идентификатор созданной задачи
   */
  async startBackgroundImprovement(description: string, userId: string): Promise<{ taskId: string }> {
    if (!this.initialized) {
      throw new Error('Agent is not initialized');
    }
    
    console.log(`Starting background improvement: ${description}`);
    
    // Создаем задачу с типом BACKGROUND_IMPROVEMENT
    const task = await this.addTask(
      TaskType.BACKGROUND_IMPROVEMENT,
      description,
      {
        priority: 5, // Высокий приоритет для задач улучшения
        metadata: {
          userId,
          startedAt: new Date(),
          isBackground: true
        }
      }
    );
    
    // Запускаем самосовершенствование асинхронно без блокировки основного потока
    setTimeout(async () => {
      try {
        // Логика выполнения самосовершенствования
        const result = await this.performSelfImprovement(description);
        
        // Обновление статуса задачи
        await this.updateTaskStatus(task.id, TaskStatus.COMPLETED, {
          success: true,
          message: `Self-improvement completed: ${description}`,
          createdFiles: result.createdFiles || [],
          updatedFiles: result.updatedFiles || []
        });
        
        // Логируем результат в CG log
        await this.logSelfImprovement(description, result);
        
        // Отправляем уведомление администраторам
        await this.notifyAdmins(`✅ Фоновое улучшение завершено: ${description}\n\nРезультаты:\n${JSON.stringify(result, null, 2)}`);
      } catch (error) {
        console.error('Error during background improvement:', error);
        
        await this.updateTaskStatus(task.id, TaskStatus.FAILED, {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
        
        await this.notifyAdmins(`❌ Ошибка фонового улучшения: ${description}\n\nОшибка: ${error instanceof Error ? error.message : String(error)}`);
      }
    }, 0);
    
    return { taskId: task.id };
  }
  
  /**
   * Получение статуса фоновой задачи самосовершенствования
   * @param taskId ID задачи
   * @returns Статус задачи и результаты
   */
  async getBackgroundImprovementStatus(taskId: string): Promise<{ 
    status: TaskStatus; 
    result?: any;
  }> {
    const task = this.state.tasks.get(taskId);
    
    if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
    }
    
    if (task.type !== TaskType.BACKGROUND_IMPROVEMENT) {
      throw new Error(`Task with id ${taskId} is not a background improvement task`);
    }
    
    return Promise.resolve({
      status: task.status,
      result: task.result
    });
  }
  
  /**
   * Получение всех задач
   * @returns Массив всех задач
   */
  getAllTasks(): Task[] {
    return this.getAllTasksFromState(this.state);
  }
  
  /**
   * Отправка уведомления администраторам
   * @param message Сообщение для администраторов
   */
  async notifyAdmins(message: string): Promise<void> {
    console.log(`[ADMIN NOTIFICATION] ${message}`);
    
    // В реальной реализации здесь будет отправка уведомлений администраторам
    // через настроенные каналы связи (Telegram, email, etc.)
    
    // Логируем сообщение
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const logsDir = path.join(__dirname, '../../../logs');
    
    // Создаем директорию логов, если она не существует
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    const logFile = path.join(logsDir, 'admin-notifications.log');
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n\n`;
    
    fs.appendFileSync(logFile, logEntry);
  }

  /**
   * Выполнение задачи самосовершенствования
   * @param description Описание задачи
   * @returns Результат выполнения
   */
  private async performSelfImprovement(description: string): Promise<any> {
    console.log(`Performing self-improvement: ${description}`);
    
    // Здесь будет логика выполнения задачи самосовершенствования через MCP
    // В тестовом режиме просто возвращаем заглушку с успешным результатом
    
    // Эмулируем выполнение задачи
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      success: true,
      message: `Улучшение "${description}" успешно выполнено`,
      createdFiles: ['src/example-improvement.ts'],
      updatedFiles: ['src/bot/agent/index.ts']
    };
  }

  /**
   * Логирование результатов самосовершенствования в CG Log
   */
  private async logSelfImprovement(description: string, result: any): Promise<void> {
    await logSelfImprovement(description, result);
  }

  /**
   * Обновление статуса задачи
   */
  private async updateTaskStatus(taskId: string, status: TaskStatus, result?: any): Promise<void> {
    updateTaskStatusInState(this.state, taskId, status, result);
  }

  /**
   * Получение всех задач из состояния
   */
  private getAllTasksFromState(state: any): Task[] {
    return getAllTasksFromState(state);
  }
}

// Базовый класс для обработчиков задач
abstract class BaseTaskHandler implements TaskHandler {
  protected mcpService: Service;
  
  constructor(mcpService: Service) {
    this.mcpService = mcpService;
  }
  
  abstract canHandle(task: Task): boolean;
  abstract handle(task: Task, state: AgentState): Promise<any>;
  
  // Общий метод для обработки запросов через MCP
  protected async processMcpRequest(prompt: string): Promise<string> {
    try {
      const result = await this.mcpService.processTask(prompt);
      return result.toString();
    } catch (error) {
      console.error('Error processing MCP request:', error);
      throw error;
    }
  }
}

// Обработчик для анализа кода
class CodeAnalysisHandler extends BaseTaskHandler {
  canHandle(task: Task): boolean {
    return task.type === TaskType.CODE_ANALYSIS;
  }
  
  async handle(task: Task, state: AgentState): Promise<any> {
    console.log(`Analyzing code: ${task.description}`);
    
    const prompt = `Analyze the following code: ${task.description}
    
    Please provide:
    1. Overview of the code structure
    2. Potential issues or bugs
    3. Performance concerns
    4. Security vulnerabilities
    5. Recommendations for improvement
    `;
    
    const analysis = await this.processMcpRequest(prompt);
    
    return {
      analysis,
      timestamp: new Date(),
    };
  }
}

// Обработчик для генерации кода
class CodeGenerationHandler extends BaseTaskHandler {
  canHandle(task: Task): boolean {
    return task.type === TaskType.CODE_GENERATION;
  }
  
  async handle(task: Task, state: AgentState): Promise<any> {
    console.log(`Generating code: ${task.description}`);
    
    const prompt = `Generate code for the following requirement: ${task.description}
    
    Please provide:
    1. Complete working code
    2. Explanation of key components
    3. Any necessary imports or dependencies
    4. Unit tests if applicable
    `;
    
    const generatedCode = await this.processMcpRequest(prompt);
    
    return {
      code: generatedCode,
      timestamp: new Date(),
    };
  }
}

// Обработчик для рефакторинга кода
class CodeRefactoringHandler extends BaseTaskHandler {
  canHandle(task: Task): boolean {
    return task.type === TaskType.CODE_REFACTORING;
  }
  
  async handle(task: Task, state: AgentState): Promise<any> {
    console.log(`Refactoring code: ${task.description}`);
    
    // Получаем исходный код из метаданных задачи
    const sourceCode = task.metadata.sourceCode;
    
    if (!sourceCode) {
      throw new Error('No source code provided for refactoring');
    }
    
    const prompt = `Refactor the following code:
    
    ${sourceCode}
    
    Following these guidelines:
    ${task.description}
    
    Please provide:
    1. Refactored code
    2. Explanation of changes
    3. Benefits of the refactoring
    `;
    
    const refactoredCode = await this.processMcpRequest(prompt);
    
    return {
      originalCode: sourceCode,
      refactoredCode,
      timestamp: new Date(),
    };
  }
}

// Обработчик для генерации тестов
class TestGenerationHandler extends BaseTaskHandler {
  canHandle(task: Task): boolean {
    return task.type === TaskType.TEST_GENERATION;
  }
  
  async handle(task: Task, state: AgentState): Promise<any> {
    console.log(`Generating tests: ${task.description}`);
    
    // Получаем код, для которого нужно создать тесты
    const sourceCode = task.metadata.sourceCode;
    
    if (!sourceCode) {
      throw new Error('No source code provided for test generation');
    }
    
    const prompt = `Generate tests for the following code:
    
    ${sourceCode}
    
    Testing requirements:
    ${task.description}
    
    Please provide:
    1. Complete test code
    2. Test cases covering different scenarios
    3. Mocks or stubs if necessary
    4. Instructions for running the tests
    `;
    
    const testCode = await this.processMcpRequest(prompt);
    
    return {
      sourceCode,
      testCode,
      timestamp: new Date(),
    };
  }
}

// Обработчик для создания документации
class DocumentationHandler extends BaseTaskHandler {
  canHandle(task: Task): boolean {
    return task.type === TaskType.DOCUMENTATION;
  }
  
  async handle(task: Task, state: AgentState): Promise<any> {
    console.log(`Creating documentation: ${task.description}`);
    
    // Получаем код, для которого нужно создать документацию
    const sourceCode = task.metadata.sourceCode;
    
    const prompt = sourceCode 
      ? `Create documentation for the following code:
    
      ${sourceCode}
      
      Documentation requirements:
      ${task.description}
      
      Please provide comprehensive documentation including:
      1. Overview
      2. API reference
      3. Usage examples
      4. Best practices
      `
      : `Create documentation for: ${task.description}
      
      Please provide comprehensive documentation including:
      1. Overview
      2. Structure
      3. Usage examples
      4. Best practices
      `;
    
    const documentation = await this.processMcpRequest(prompt);
    
    return {
      sourceCode: sourceCode || null,
      documentation,
      timestamp: new Date(),
    };
  }
}

// Обработчик для управления зависимостями
class DependencyManagementHandler extends BaseTaskHandler {
  canHandle(task: Task): boolean {
    return task.type === TaskType.DEPENDENCY_MANAGEMENT;
  }
  
  async handle(task: Task, state: AgentState): Promise<any> {
    console.log(`Managing dependencies: ${task.description}`);
    
    // Получаем текущий файл зависимостей (package.json, requirements.txt и т.д.)
    const dependencyFile = task.metadata.dependencyFile;
    
    if (!dependencyFile) {
      throw new Error('No dependency file provided');
    }
    
    const prompt = `Update dependencies in the following file:
    
    ${dependencyFile.content}
    
    With the following requirements:
    ${task.description}
    
    Please provide:
    1. Updated dependency file
    2. List of changes made
    3. Installation instructions if needed
    4. Potential compatibility issues
    `;
    
    const updatedDependencies = await this.processMcpRequest(prompt);
    
    return {
      originalFile: dependencyFile.content,
      updatedDependencies,
      timestamp: new Date(),
    };
  }
}

// Обработчик для операций с Git
class GitOperationsHandler extends BaseTaskHandler {
  canHandle(task: Task): boolean {
    return task.type === TaskType.GIT_OPERATIONS;
  }
  
  async handle(task: Task, state: AgentState): Promise<any> {
    console.log(`Performing Git operations: ${task.description}`);
    
    const prompt = `Create Git commands to: ${task.description}
    
    Please provide:
    1. Complete Git commands with explanations
    2. Proper sequence of commands
    3. Handling of potential conflicts or issues
    `;
    
    const gitCommands = await this.processMcpRequest(prompt);
    
    return {
      gitCommands,
      timestamp: new Date(),
    };
  }
}

// Функция для создания агента
export function createAgent(config: AgentConfig): AutonomousAgent {
  return new AutonomousAgent(config);
}

/**
 * Логирование результатов самосовершенствования в CG Log
 */
async function logSelfImprovement(description: string, result: any): Promise<void> {
  try {
    // Получаем путь к директории CG Log
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const cgLogDir = path.join(__dirname, '../../cg-log');
    
    // Проверяем, существует ли README.md
    const readmePath = path.join(cgLogDir, 'README.md');
    
    if (!fs.existsSync(cgLogDir)) {
      fs.mkdirSync(cgLogDir, { recursive: true });
    }
    
    let content = '';
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (fs.existsSync(readmePath)) {
      content = fs.readFileSync(readmePath, 'utf-8');
    } else {
      content = '# Лог изменений агента-разработчика (CG Log)\n\n' +
        'Этот каталог содержит информацию о самосовершенствовании агента - ' +
        'историю изменений, внесенных в кодовую базу в рамках процесса самосовершенствования.\n\n' +
        '## История улучшений\n\n';
    }
    
    // Создаем запись для нового улучшения
    const entry = `### ${timestamp} - ${description}\n\n`;
    
    // Добавляем детали о созданных и обновленных файлах
    let details = '';
    
    if (result.createdFiles && result.createdFiles.length > 0) {
      details += '1. Созданные файлы:\n';
      for (const file of result.createdFiles) {
        details += `   - ${file}\n`;
      }
      details += '\n';
    }
    
    if (result.updatedFiles && result.updatedFiles.length > 0) {
      details += `${details ? '2' : '1'}. Обновленные файлы:\n`;
      for (const file of result.updatedFiles) {
        details += `   - ${file}\n`;
      }
      details += '\n';
    }
    
    if (result.message) {
      details += `${details ? '3' : '1'}. Результат: ${result.message}\n\n`;
    }
    
    // Вставляем новую запись после заголовка "История улучшений"
    const insertPoint = content.indexOf('## История улучшений') + '## История улучшений'.length;
    const newContent = content.slice(0, insertPoint) + '\n\n' + entry + details + content.slice(insertPoint);
    
    // Записываем обновленный файл
    fs.writeFileSync(readmePath, newContent, 'utf-8');
    
    console.log(`✅ Self-improvement logged: ${description}`);
  } catch (error) {
    console.error('Error logging self-improvement:', error);
  }
} 