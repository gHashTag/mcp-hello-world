export const DEFAULT_TASK_PRIORITY = 1;
export const MAX_TASK_PRIORITY = 10;
export const MIN_TASK_PRIORITY = 1;
export const TASK_QUEUE_SIZE = 100;
export const MAX_CONCURRENT_TASKS = 5;
export const RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000; // ms
export const LOG_LEVELS = {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    DEBUG: 'debug'
};
export const LOG_EMOJIS = {
    [LOG_LEVELS.ERROR]: '❌',
    [LOG_LEVELS.WARN]: '⚠️',
    [LOG_LEVELS.INFO]: 'ℹ️',
    [LOG_LEVELS.DEBUG]: '🔍'
};
export const TASK_TYPE_EMOJIS = {
    DEVELOPMENT: '👨‍💻',
    CODE_REVIEW: '👀',
    TESTING: '🧪',
    DOCUMENTATION: '📝',
    MAINTENANCE: '🔧'
};
export const TASK_STATUS_EMOJIS = {
    PENDING: '⏳',
    IN_PROGRESS: '🔄',
    COMPLETED: '✅',
    FAILED: '❌',
    CANCELLED: '⛔️'
};
export const DEFAULT_CONFIG = {
    logLevel: LOG_LEVELS.INFO,
    enableConsoleLogging: true,
    enableFileLogging: false,
    logFilePath: './logs/bot.log',
    maxConcurrentTasks: MAX_CONCURRENT_TASKS,
    taskQueueSize: TASK_QUEUE_SIZE,
    retryAttempts: RETRY_ATTEMPTS,
    retryDelay: RETRY_DELAY
};
