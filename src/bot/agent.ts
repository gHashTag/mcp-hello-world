import { AgentState, BotConfig, IBot, Task } from './types';
import { MCPServiceImpl } from './services/mcp';
import { handleTask } from './handlers';

export class Agent implements IBot {
  private state: AgentState = {
    isRunning: false,
    tasks: [],
    completedTasks: 0,
    failedTasks: 0
  };

  private mcpService: MCPServiceImpl;

  constructor(private config: BotConfig) {
    this.mcpService = new MCPServiceImpl(config);
  }

  async start(): Promise<void> {
    console.log('🚀 Starting agent...');
    
    try {
      await this.mcpService.initialize();
      this.state.isRunning = true;
      console.log('✅ Agent started successfully');
    } catch (error) {
      console.error('❌ Failed to start agent:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    console.log('🔄 Stopping agent...');
    
    try {
      await this.mcpService.close();
      this.state.isRunning = false;
      console.log('✅ Agent stopped successfully');
    } catch (error) {
      console.error('❌ Failed to stop agent:', error);
      throw error;
    }
  }

  async addTask(task: Task): Promise<void> {
    console.log(`📥 Adding task ${task.id} to queue...`);
    
    if (!this.state.isRunning) {
      throw new Error('Agent is not running');
    }

    this.state.tasks.push(task);
    await this.processNextTask();
  }

  private async processNextTask(): Promise<void> {
    if (this.state.tasks.length === 0) {
      return;
    }

    const task = this.state.tasks[0];
    task.status = 'processing';

    try {
      await handleTask(task, this.mcpService);
      this.state.completedTasks++;
      task.status = 'completed';
      console.log(`✅ Task ${task.id} completed successfully`);
    } catch (error) {
      this.state.failedTasks++;
      task.status = 'failed';
      console.error(`❌ Task ${task.id} failed:`, error);
    } finally {
      this.state.tasks.shift();
    }
  }

  getState(): AgentState {
    return { ...this.state };
  }
} 