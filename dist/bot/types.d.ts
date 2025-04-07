import type { MCPClient } from '@modelcontextprotocol/sdk';
export declare enum TaskType {
    DEVELOPMENT = "DEVELOPMENT",
    CODE_REVIEW = "CODE_REVIEW",
    TESTING = "TESTING",
    DOCUMENTATION = "DOCUMENTATION",
    MAINTENANCE = "MAINTENANCE"
}
export interface Task {
    id: string;
    type: TaskType;
    data: any;
    createdAt: Date;
    status: 'pending' | 'processing' | 'completed' | 'failed';
}
export interface BotConfig {
    token: string;
    mcpServerUrl: string;
    mcpApiKey: string;
    debug?: boolean;
}
export interface AgentState {
    isRunning: boolean;
    tasks: Task[];
    completedTasks: number;
    failedTasks: number;
}
export interface IBot {
    start(): Promise<void>;
    stop(): Promise<void>;
    addTask(task: Task): Promise<void>;
    getState(): AgentState;
}
export interface MCPService {
    initialize(): Promise<void>;
    close(): Promise<void>;
    getClient(): MCPClient;
}
