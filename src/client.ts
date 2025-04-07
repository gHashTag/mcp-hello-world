import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

async function main() {
  console.log("🚀 Запуск MCP клиента...");

  const baseUrl = new URL("http://localhost:3001");
  const transport = new SSEClientTransport(baseUrl);

  const client = new Client(
    {
      name: "hello-world-client",
      version: "1.0.0"
    },
    {
      capabilities: {
        tools: {}
      }
    }
  );

  try {
    await client.connect(transport);
    console.log("✅ Подключено к серверу");

    // Вызываем инструмент hello
    const result = await client.callTool({
      name: "hello",
      arguments: {
        name: "Друг"
      }
    });

    if (result.content && Array.isArray(result.content) && result.content.length > 0) {
      const content = result.content[0];
      if ('text' in content) {
        console.log("📬 Ответ от сервера:", content.text);
      }
    }
  } catch (error) {
    console.error("❌ Ошибка:", error);
  } finally {
    await transport.close();
    console.log("👋 Отключено от сервера");
  }
}

main(); 