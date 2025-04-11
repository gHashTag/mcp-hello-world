/**
 * Утилита для работы с файловой системой
 * Поддерживает создание файлов и директорий
 */

import fs from 'fs';
import path from 'path';

/**
 * Проверяет, существует ли файл или директория
 */
export function exists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * Создает директорию рекурсивно (включая все родительские директории)
 */
export function createDirectory(dirPath: string): void {
  if (!exists(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Создана директория: ${dirPath}`);
  }
}

/**
 * Создает файл с указанным содержимым
 * Если директория не существует, она будет создана автоматически
 */
export function createFile(filePath: string, content: string): void {
  // Создаем родительские директории, если они не существуют
  const dirPath = path.dirname(filePath);
  createDirectory(dirPath);
  
  // Записываем содержимое в файл
  fs.writeFileSync(filePath, content);
  console.log(`✅ Создан файл: ${filePath}`);
}

/**
 * Читает содержимое файла
 */
export function readFile(filePath: string): string {
  if (!exists(filePath)) {
    throw new Error(`Файл не существует: ${filePath}`);
  }
  
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Извлекает информацию о файле из сгенерированного кода
 * @param generatedCode Сгенерированный код от LLM
 * @returns Массив объектов с информацией о файлах (путь и содержимое)
 */
export function extractFilesFromGeneratedCode(generatedCode: string): Array<{ path: string, content: string }> {
  const files: Array<{ path: string, content: string }> = [];
  
  // Поиск путей к файлам в формате: "src/path/to/file.ts"
  const filePathRegex = /["']((?:\.\/)?src\/[\w\/-]+\.\w+)["']/g;
  const paths = new Set<string>();
  
  let match;
  while ((match = filePathRegex.exec(generatedCode)) !== null) {
    paths.add(match[1]);
  }
  
  // Поиск блоков кода с содержимым файлов
  const codeBlockRegex = /```(?:typescript|javascript|ts|js|jsx|tsx)?\s*(?:\/\/\s*File:\s*((?:\.\/)?src\/[\w\/-]+\.\w+))?\s*\n([\s\S]*?)```/g;
  
  while ((match = codeBlockRegex.exec(generatedCode)) !== null) {
    const filePath = match[1];
    const content = match[2].trim();
    
    if (filePath) {
      files.push({
        path: filePath,
        content
      });
    }
  }
  
  return files;
}

/**
 * Создает файлы на основе сгенерированного кода
 * @param generatedCode Сгенерированный код от LLM
 * @param basePath Базовый путь проекта (по умолчанию текущая директория)
 * @returns Массив созданных файлов
 */
export function createFilesFromGeneratedCode(generatedCode: string, basePath: string = process.cwd()): string[] {
  const files = extractFilesFromGeneratedCode(generatedCode);
  const createdFiles: string[] = [];
  
  if (files.length === 0) {
    console.warn('⚠️ Не удалось обнаружить файлы в сгенерированном коде');
    return [];
  }
  
  for (const file of files) {
    const fullPath = path.resolve(basePath, file.path);
    createFile(fullPath, file.content);
    createdFiles.push(fullPath);
  }
  
  return createdFiles;
} 