import { testMcpService } from './mcp.test.js';

const runTests = async () => {
  console.log('🚀 Starting test suite...');
  
  const results = await testMcpService();
  
  if (results.passed) {
    console.log('✅ All tests passed!');
    process.exit(0);
  } else {
    console.error('❌ Tests failed:');
    results.errors.forEach(error => console.error(`- ${error}`));
    process.exit(1);
  }
};

runTests().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}); 