export declare const DEFAULT_TASK_PRIORITY = 1;
export declare const MAX_TASK_PRIORITY = 10;
export declare const MIN_TASK_PRIORITY = 1;
export declare const TASK_QUEUE_SIZE = 100;
export declare const MAX_CONCURRENT_TASKS = 5;
export declare const RETRY_ATTEMPTS = 3;
export declare const RETRY_DELAY = 1000;
export declare const LOG_LEVELS: {
    readonly ERROR: "error";
    readonly WARN: "warn";
    readonly INFO: "info";
    readonly DEBUG: "debug";
};
export declare const LOG_EMOJIS: {
    readonly error: "❌";
    readonly warn: "⚠️";
    readonly info: "ℹ️";
    readonly debug: "🔍";
};
export declare const TASK_TYPE_EMOJIS: {
    readonly DEVELOPMENT: "👨‍💻";
    readonly CODE_REVIEW: "👀";
    readonly TESTING: "🧪";
    readonly DOCUMENTATION: "📝";
    readonly MAINTENANCE: "🔧";
};
export declare const TASK_STATUS_EMOJIS: {
    readonly PENDING: "⏳";
    readonly IN_PROGRESS: "🔄";
    readonly COMPLETED: "✅";
    readonly FAILED: "❌";
    readonly CANCELLED: "⛔️";
};
export declare const DEFAULT_CONFIG: {
    readonly logLevel: "info";
    readonly enableConsoleLogging: true;
    readonly enableFileLogging: false;
    readonly logFilePath: "./logs/bot.log";
    readonly maxConcurrentTasks: 5;
    readonly taskQueueSize: 100;
    readonly retryAttempts: 3;
    readonly retryDelay: 1000;
};
