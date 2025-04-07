import { Handler, Context } from '../types.js';
import { createMcpService } from '../services/mcp.js';

export const developmentHandler: Handler = async (ctx: Context) => {
  const service = createMcpService();
  await service.initialize();
  
  try {
    console.log('🔄 Обработка запроса...');
    const result = await service.processTask(ctx.message);
    
    // Форматируем ответ
    if (result?.completion?.values?.[0]) {
      await ctx.reply(result.completion.values[0]);
    } else {
      await ctx.reply('Не удалось получить ответ от сервера');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Ошибка при обработке запроса:', error);
    await ctx.reply('Произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.');
    throw error;
  } finally {
    await service.close();
  }
}; 