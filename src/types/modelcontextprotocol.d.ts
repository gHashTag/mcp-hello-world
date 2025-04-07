declare module '@modelcontextprotocol/sdk' {
  export class MCPClient {
    constructor(config: { serverUrl: string; apiKey: string });
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    sendMessage(data: any): Promise<void>;
  }
} 