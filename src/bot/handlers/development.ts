import { Task, TaskType, MCPService } from '../types';

export async function handleDevelopmentTask(task: Task, mcpService: MCPService): Promise<void> {
  console.log(`🚀 Processing development task ${task.id}...`);

  if (task.type !== TaskType.DEVELOPMENT) {
    throw new Error(`Invalid task type: ${task.type}`);
  }

  try {
    const client = mcpService.getClient();
    
    // Отправляем задачу в MCP
    console.log('📤 Sending task to MCP:', task.data);
    await client.sendMessage(task.data);
    
    console.log('✅ Development task completed successfully');
  } catch (error) {
    console.error('❌ Failed to process development task:', error);
    throw error;
  }
} 