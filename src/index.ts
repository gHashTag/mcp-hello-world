import { MCPService } from './bot/services/mcp';
import { Task, TaskType } from './bot/types';
import { handleTask } from './bot/handlers';

async function main() {
  const mcpService = new MCPService(
    process.env.MCP_SERVER_URL || 'http://localhost:8080',
    process.env.MCP_API_KEY || ''
  );

  try {
    console.log('🚀 Запуск приложения...');
    await mcpService.initialize();

    // Пример задачи для тестирования
    const task: Task = {
      id: '1',
      type: TaskType.DEVELOPMENT,
      description: 'Тестовая задача разработки',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await handleTask(task, mcpService);
  } catch (error) {
    console.error('❌ Ошибка в приложении:', error);
    process.exit(1);
  } finally {
    await mcpService.close();
  }
}

main().catch(error => {
  console.error('❌ Необработанная ошибка:', error);
  process.exit(1);
}); 