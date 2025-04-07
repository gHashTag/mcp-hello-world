import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { TEST_CONFIG } from "./test-config.js";

const { emoji } = TEST_CONFIG.logging;

interface ToolResponse {
  content?: Array<{
    type: string;
    text: string;
  }>;
}

async function runTests() {
  console.log(`${emoji.start} Запуск тестов...`);

  try {
    const baseUrl = new URL(`http://${TEST_CONFIG.server.host}:${TEST_CONFIG.server.port}/sse`);
    console.log(`${emoji.info} Подключение к серверу: ${baseUrl.toString()}`);
    
    const transport = new SSEClientTransport(baseUrl);
    const client = new Client(
      {
        name: "test-client",
        version: "1.0.0"
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    await client.connect(transport);
    console.log(`${emoji.success} Подключено к серверу`);

    // Тест 1: Базовый вызов без параметров
    console.log(`${emoji.test} Тест 1: Вызов hello без параметров`);
    const result1 = await client.callTool({
      name: "hello",
      arguments: {}
    }) as ToolResponse;
    
    const response1 = result1.content && result1.content.length > 0 ? result1.content[0] : null;
    if (!response1?.text?.includes("Привет")) {
      throw new Error("Тест 1 провален: Ответ не содержит приветствие");
    }
    console.log(`${emoji.success} Тест 1 пройден`);

    // Тест 2: Вызов с пользовательским именем
    console.log(`${emoji.test} Тест 2: Вызов hello с именем`);
    const result2 = await client.callTool({
      name: "hello",
      arguments: {
        name: "Тестер"
      }
    }) as ToolResponse;

    const response2 = result2.content && result2.content.length > 0 ? result2.content[0] : null;
    if (!response2?.text?.includes("Тестер")) {
      throw new Error("Тест 2 провален: Ответ не содержит пользовательское имя");
    }
    console.log(`${emoji.success} Тест 2 пройден`);

    await transport.close();
    console.log(`${emoji.complete} Все тесты успешно пройдены`);
    process.exit(0);

  } catch (error) {
    console.error(`${emoji.error} Ошибка при выполнении тестов:`, error);
    process.exit(1);
  }
}

runTests(); 