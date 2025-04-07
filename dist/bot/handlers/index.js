import { TaskType } from '../types';
import { handleDevelopmentTask } from './development';
export async function handleTask(task, mcpService) {
    switch (task.type) {
        case TaskType.DEVELOPMENT:
            return handleDevelopmentTask(task, mcpService);
        case TaskType.CODE_REVIEW:
        case TaskType.TESTING:
        case TaskType.DOCUMENTATION:
        case TaskType.MAINTENANCE:
            throw new Error(`Handler not implemented for task type: ${task.type}`);
        default:
            throw new Error(`Unknown task type: ${task.type}`);
    }
}
