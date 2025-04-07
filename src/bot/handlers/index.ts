import { Task, TaskType } from '../types';
import { MCPService } from '../services/mcp';
import { handleDevelopmentTask } from './development';

export async function handleTask(task: Task, mcpService: MCPService): Promise<void> {
  console.log('🎯 Получена задача:', {
    id: task.id,
    type: task.type,
    description: task.description
  });

  switch (task.type) {
    case TaskType.DEVELOPMENT:
      await handleDevelopmentTask(task, mcpService);
      break;

    case TaskType.CODE_REVIEW:
      throw new Error('Обработчик для CODE_REVIEW не реализован');

    case TaskType.TESTING:
      throw new Error('Обработчик для TESTING не реализован');

    case TaskType.DOCUMENTATION:
      throw new Error('Обработчик для DOCUMENTATION не реализован');

    case TaskType.MAINTENANCE:
      throw new Error('Обработчик для MAINTENANCE не реализован');

    default:
      throw new Error(`Неизвестный тип задачи: ${task.type}`);
  }
} 