import { MCPServiceImpl } from './services/mcp';
import { handleTask } from './handlers';
export class Agent {
    constructor(config) {
        this.config = config;
        this.state = {
            isRunning: false,
            tasks: [],
            completedTasks: 0,
            failedTasks: 0
        };
        this.mcpService = new MCPServiceImpl(config);
    }
    async start() {
        console.log('🚀 Starting agent...');
        try {
            await this.mcpService.initialize();
            this.state.isRunning = true;
            console.log('✅ Agent started successfully');
        }
        catch (error) {
            console.error('❌ Failed to start agent:', error);
            throw error;
        }
    }
    async stop() {
        console.log('🔄 Stopping agent...');
        try {
            await this.mcpService.close();
            this.state.isRunning = false;
            console.log('✅ Agent stopped successfully');
        }
        catch (error) {
            console.error('❌ Failed to stop agent:', error);
            throw error;
        }
    }
    async addTask(task) {
        console.log(`📥 Adding task ${task.id} to queue...`);
        if (!this.state.isRunning) {
            throw new Error('Agent is not running');
        }
        this.state.tasks.push(task);
        await this.processNextTask();
    }
    async processNextTask() {
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
        }
        catch (error) {
            this.state.failedTasks++;
            task.status = 'failed';
            console.error(`❌ Task ${task.id} failed:`, error);
        }
        finally {
            this.state.tasks.shift();
        }
    }
    getState() {
        return { ...this.state };
    }
}
