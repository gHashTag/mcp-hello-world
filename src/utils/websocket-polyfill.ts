/**
 * Полифилл WebSocket для работы в разных средах выполнения
 * Необходим для корректной работы MCP SDK, которое ожидает глобальный WebSocket
 */

import WebSocket from 'ws';

// Проверяем наличие глобального объекта WebSocket
if (typeof globalThis.WebSocket === 'undefined') {
  console.log('📡 Инициализация WebSocket полифилла...');
  
  // Устанавливаем WebSocket в глобальную область видимости
  (globalThis as any).WebSocket = WebSocket;
  
  console.log('✅ WebSocket полифилл установлен');
}

// Экспортируем для явного импорта
export default WebSocket; 