/**
 * Тест для эмуляции Telegram-интерфейса и проверки функциональности самосовершенствования
 * 
 * Этот тест эмулирует общение пользователя с агентом через Telegram
 * и проверяет, как агент обрабатывает запросы на самосовершенствование
 */

import readline from 'readline';
import { createAgent } from '../bot/agent/index.js';
import { TaskType } from '../bot/agent/state.js';

// Создаем интерфейс для чтения ввода пользователя
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
}); 