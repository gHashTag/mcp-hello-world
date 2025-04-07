export interface TestResult {
  success: boolean;
  message: string;
  error?: Error;
}

export const TEST_CONFIG = {
  server: {
    host: process.env.MCP_SERVER_HOST || 'mcp-server',
    port: parseInt(process.env.MCP_SERVER_PORT || '3001'),
  },
  logging: {
    enabled: true,
    emoji: {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      start: '🚀',
      complete: '🏁',
      validate: '🔍',
      event: '⚡️',
      test: '🎯',
      retry: '🔄',
      data: '💾'
    }
  }
}; 