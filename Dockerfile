FROM node:20-slim

WORKDIR /app

# Установка зависимостей
COPY package*.json ./
RUN npm install

# Копирование исходного кода
COPY . .

# Сборка TypeScript
RUN npm run build

# Открываем порт для сервера
EXPOSE 3001

# Запускаем сервер по умолчанию
CMD ["npm", "run", "dev:server"] 