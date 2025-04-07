import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import express from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";

const server = new McpServer({
  name: "hello-world-server",
  version: "1.0.0"
});

// Добавляем простой инструмент
server.tool(
  "hello",
  { name: z.string().optional() },
  async ({ name = "World" }) => ({
    content: [{ 
      type: "text", 
      text: `🌟 Привет, ${name}! Это сообщение от MCP сервера!` 
    }]
  })
);

// Создаем Express приложение
const app = express();
const transports: {[sessionId: string]: SSEServerTransport} = {};

// Настраиваем SSE endpoint
app.get("/sse", async (_, res) => {
  console.log("🚀 Новое SSE подключение");
  const transport = new SSEServerTransport('/messages', res);
  transports[transport.sessionId] = transport;
  
  res.on("close", () => {
    console.log(`❌ SSE подключение закрыто: ${transport.sessionId}`);
    delete transports[transport.sessionId];
  });
  
  await server.connect(transport);
});

// Настраиваем endpoint для сообщений
app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports[sessionId];
  
  if (transport) {
    console.log(`✉️ Получено сообщение для сессии: ${sessionId}`);
    await transport.handlePostMessage(req, res);
  } else {
    console.log(`❌ Транспорт не найден для сессии: ${sessionId}`);
    res.status(400).send('Транспорт не найден для указанного sessionId');
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 MCP сервер запущен на порту ${PORT}`);
}); 