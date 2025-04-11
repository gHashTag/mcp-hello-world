/**
 * Скрипт для запуска всей системы автономного агента
 */

import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Запускаем процесс с предварительной сборкой
async function runProcess(command: string, args: string[], name: string, color: string): Promise<ChildProcess> {
  console.log(`${color}[${name}] Запуск процесса...${colors.reset}`);
  
  // Сначала выполняем сборку проекта
  await new Promise<void>((resolve, reject) => {
    console.log(`${color}[${name}] Сборка проекта...${colors.reset}`);
    const buildProcess = spawn('npm', ['run', 'build'], { cwd: rootDir });
    
    buildProcess.stdout.on('data', (data) => {
      console.log(`${color}[${name}] ${data.toString().trim()}${colors.reset}`);
    });
    
    buildProcess.stderr.on('data', (data) => {
      console.error(`${color}[${name}] ${data.toString().trim()}${colors.reset}`);
    });
    
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`${color}[${name}] Сборка завершена успешно${colors.reset}`);
        resolve();
      } else {
        console.error(`${color}[${name}] Ошибка сборки, код: ${code}${colors.reset}`);
        reject(new Error(`Ошибка сборки, код: ${code}`));
      }
    });
  });
  
  // Затем запускаем нужный процесс
  const process = spawn(command, args, { cwd: rootDir });
  
  process.stdout.on('data', (data) => {
    console.log(`${color}[${name}] ${data.toString().trim()}${colors.reset}`);
  });
  
  process.stderr.on('data', (data) => {
    console.error(`${color}[${name}] ${data.toString().trim()}${colors.reset}`);
  });
  
  process.on('close', (code) => {
    console.log(`${color}[${name}] Процесс завершился с кодом ${code}${colors.reset}`);
  });
  
  return process;
}

// Главная функция
async function main() {
  console.log('🚀 Запуск системы автономного агента...');
  
  try {
    // Запускаем мок-сервер
    const mockServerProcess = await runProcess('node', ['dist/test-utils/mock-server.js'], 'Mock Server', colors.cyan);
    
    // Даем серверу время на запуск
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Запускаем тесты с агентом
    const agentTestProcess = await runProcess('node', ['dist/test-utils/agent.test.js'], 'Agent Test', colors.green);
    
    // Обработка завершения
    process.on('SIGINT', async () => {
      console.log('\n🛑 Получен сигнал остановки, завершаем все процессы...');
      
      mockServerProcess.kill('SIGINT');
      agentTestProcess.kill('SIGINT');
      
      // Даем время процессам корректно завершиться
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Все процессы остановлены');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Ошибка запуска системы:', error);
    process.exit(1);
  }
}

// Запускаем систему
main().catch(error => {
  console.error('❌ Неперехваченная ошибка:', error);
  process.exit(1);
}); 