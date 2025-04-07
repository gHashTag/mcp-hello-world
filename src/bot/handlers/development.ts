import { Task, TaskType } from '../types';
import { MCPService } from '../services/mcp';

export async function handleDevelopmentTask(task: Task, mcpService: MCPService): Promise<void> {
  if (task.type !== TaskType.DEVELOPMENT) {
    throw new Error('Неверный тип задачи');
  }

  console.log('🚀 Обработка задачи разработки:', {
    id: task.id,
    description: task.description,
    metadata: task.metadata
  });

  try {
    await mcpService.processTask({
      type: 'development',
      task: {
        id: task.id,
        description: task.description,
        metadata: task.metadata
      }
    });

    console.log('✅ Задача разработки успешно обработана');
  } catch (error) {
    console.error('❌ Ошибка при обработке задачи разработки:', error);
    throw error;
  }
} 