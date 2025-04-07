# MCP Hello World

Этот проект демонстрирует взаимодействие с Docker Gordon MCP (Model Context Protocol).

## Содержание

- [Установка](#установка)
- [Запуск](#запуск)
- [MCP сервер времени](#mcp-сервер-времени)
- [Конфигурация](#конфигурация)
- [Известные проблемы](#известные-проблемы)
- [Полезные ссылки](#полезные-ссылки)

## Установка

```bash
# Клонируйте репозиторий
git clone <url-репозитория>
cd mcp-hello-world

# Установите зависимости
npm install
```

## Запуск

### Запуск клиента MCP

```bash
# Сборка проекта
npm run build

# Запуск клиента без Gordon MCP
npm start

# Запуск клиента с Gordon MCP
USE_GORDON_MCP=true npm start
```

### Запуск Gordon MCP сервера

```bash
# Запуск Docker Gordon MCP сервера
./scripts/start-gordon-mcp.sh
```

### Запуск всех компонентов одновременно

```bash
# Сборка и запуск всех компонентов
npm run all-in-one
```

## MCP сервер времени

В этом проекте реализован собственный MCP сервер времени с несколькими инструментами:

1. **getCurrentTime** - получение текущего времени с возможностью указания формата и временной зоны
2. **addTime** - добавление времени к указанной дате
3. **calculateDateDifference** - вычисление разницы между двумя датами
4. **getTimeInfo** - получение информации о текущем времени в разных форматах

### Сборка и запуск MCP сервера времени

```bash
# Сборка и установка сервера времени
cd mcp/time-tool
npm install
npm run build

# Запуск сервера времени 
npm start
```

## Конфигурация

### Конфигурационный файл Gordon MCP

Для использования MCP сервера времени с Docker Gordon, создайте файл `gordon-mcp.yml` в корне проекта:

```yaml
services:
  time:
    build: 
      context: ./mcp/time-tool
    environment:
      - MCP_TRANSPORT=stdio
      - MCP_LOG_LEVEL=debug
      - MCP_COLOR_LOGS=true
      - MCP_DEFAULT_LOCALE=ru-RU
      - MCP_DEFAULT_DATE_FORMAT=yyyy-MM-dd HH:mm:ss
```

### Переменные окружения

| Переменная | Описание | Значение по умолчанию |
|------------|----------|----------------------|
| `PORT` | Порт для клиента MCP | `3000` |
| `USE_GORDON_MCP` | Включение режима Gordon MCP | `false` |
| `GORDON_MCP_PORT` | Порт для Gordon MCP сервера | `3000` |
| `MCP_TRANSPORT` | Тип транспорта MCP сервера | `stdio` |
| `MCP_LOG_LEVEL` | Уровень логирования | `info` |
| `MCP_COLOR_LOGS` | Цветные логи | `true` |
| `MCP_DEFAULT_LOCALE` | Локаль по умолчанию | `ru-RU` |
| `MCP_DEFAULT_DATE_FORMAT` | Формат даты по умолчанию | `yyyy-MM-dd HH:mm:ss` |

## Известные проблемы

1. **Проблемы с подключением к Gordon MCP**: Иногда Gordon MCP сервер может не отвечать на порту 3000. Проверьте, что сервер запущен и доступен с помощью команды:
   ```bash
   curl -v http://localhost:3000/mcp
   ```

2. **Процесс Docker занимает порт 3000**: Если порт 3000 уже занят (например, Docker AI использует его), вы можете изменить порт через переменную окружения:
   ```bash
   GORDON_MCP_PORT=3001 USE_GORDON_MCP=true npm start
   ```

## Примеры использования MCP сервера времени

### Запросы к Docker Gordon с использованием сервера времени

```bash
# Получение текущего времени
docker ai "какое сейчас время в Москве?"

# Добавление времени к дате
docker ai "какая дата будет через 3 дня и 5 часов?"

# Вычисление разницы между датами
docker ai "сколько дней между 2025-05-01 и 2025-06-15?"
```

## Полезные ссылки

- [Документация Docker Gordon MCP](https://docs.docker.com/desktop/features/gordon/mcp/)
- [Конфигурация MCP через YAML](https://docs.docker.com/desktop/features/gordon/mcp/yaml/)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- [Репозиторий Docker MCP серверов](https://github.com/docker/mcp-servers) # mcp-dev
