/**
 * Автономный агент-разработчик
 * Интегрирует все компоненты системы
 */

import { AgentState, Task, TaskType, createAgentState, addTask } from './state.js';
import { TaskScheduler, TaskHandler, createTaskScheduler } from './scheduler.js';
import { createMcpService } from '../services/mcp.js';
import { Service } from '../types.js';

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

    const task = addTask(this.state, {
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