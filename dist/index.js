import { Agent } from './bot/agent';
async function main() {
    const config = {
        token: process.env.BOT_TOKEN || '',
        mcpServerUrl: process.env.MCP_SERVER_URL || 'http://localhost:8080',
        mcpApiKey: process.env.MCP_API_KEY || '',
        debug: process.env.DEBUG === 'true'
    };
    const agent = new Agent(config);
    try {
        console.log('🚀 Starting agent...');
        await agent.start();
        console.log('✅ Agent started successfully');
    }
    catch (error) {
        console.error('❌ Failed to start agent:', error);
        process.exit(1);
    }
}
main().catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
});
