import { Handler, Context } from '../types.js';
import { createMcpService } from '../services/mcp.js';

export const developmentHandler: Handler = async (ctx: Context) => {
  const service = createMcpService();
  await service.initialize();
  
  try {
    const result = await service.processTask(ctx.message);
    return result;
  } finally {
    await service.close();
  }
}; 