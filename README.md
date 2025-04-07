# MCP Development Bot

Бот для разработки с интеграцией Model Context Protocol (MCP).

## 🚀 Возможности

- Интеграция с MCP для обработки задач разработки
- Поддержка различных типов задач (разработка, код-ревью, тестирование и др.)
- Логирование с эмодзи для лучшей читаемости
- Масштабируемая архитектура с поддержкой различных сервисов

## 🛠 Технологии

- TypeScript
- Model Context Protocol SDK
- Docker
- ESLint

## 📦 Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/yourusername/mcp-dev.git
cd mcp-dev
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл .env на основе .env.development:
```bash
cp .env.development .env
```

4. Обновите переменные окружения в .env

## 🏃‍♂️ Запуск

### Разработка

```bash
npm run dev
```

### Продакшн

```bash
npm run build
npm start
```

### Docker

```bash
npm run docker:build
npm run docker:up
```

## 📝 Переменные окружения

- `BOT_TOKEN`: Токен бота
- `MCP_SERVER_URL`: URL сервера MCP
- `MCP_API_KEY`: API ключ для MCP
- `DEBUG`: Режим отладки (true/false)

## 🧪 Тестирование

```bash
npm test
```

## 📄 Лицензия

ISC
