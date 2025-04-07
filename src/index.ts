import { createMcpService } from './bot/services/mcp.js';

async function main() {
  const service = createMcpService();
  await service.initialize();

  try {
    const result = await service.processTask('Hello, MCP!');
    console.log('🎯 Результат:', result);
  } finally {
    await service.close();
  }
}

main().catch(error => {
  console.error('❌ Ошибка:', error);
  process.exit(1);
}); 