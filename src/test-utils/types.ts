export interface TestResult {
  name: string;
  passed: boolean;
  errors: string[];
} 

export interface Context {
  message: string;
  reply: (message: string) => Promise<void>;
}