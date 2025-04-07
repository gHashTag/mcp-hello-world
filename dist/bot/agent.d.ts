import { AgentState, BotConfig, IBot, Task } from './types';
export declare class Agent implements IBot {
    private config;
    private state;
    private mcpService;
    constructor(config: BotConfig);
    start(): Promise<void>;
    stop(): Promise<void>;
    addTask(task: Task): Promise<void>;
    private processNextTask;
    getState(): AgentState;
}
