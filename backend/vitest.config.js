import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 15000,
    
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      
      // Os principais arquivos a excluir (os padrões básicos já são excluídos pelo Vitest)
      exclude: [
        '**/__tests__/**',
        '**/prisma/**',
        '**/node_modules/**',
        '**/generated/**',
        '**/types/**'
      ],
      
      // Simplificando: incluir apenas src/ e excluir o que não precisamos
      include: ['src/**/*.ts'],
    }
  },
});