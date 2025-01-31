// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // Regras gerais
      'no-console': 'warn', // Alerta para usos de console.log
      '@typescript-eslint/no-unused-vars': 'warn', // Aviso para variáveis não usadas
      '@typescript-eslint/require-await': 'off', // Não exige async em funções assíncronas,
      '@typescript-eslint/no-unsafe-return': 'off', // Desabilita retornos inseguros
      '@typescript-eslint/no-unsafe-member-access': 'off', // Desabilita acesso inseguro
      '@typescript-eslint/no-unsafe-call': 'off', // Desabilita chamadas inseguras
      '@typescript-eslint/await-thenable': 'off', // Desabilita await em thenable

      // Regras TypeScript
      '@typescript-eslint/no-explicit-any': 'off', // Alerta para o uso de "any"
      '@typescript-eslint/no-floating-promises': 'off', // Garante que promises sejam tratadas
      '@typescript-eslint/no-unsafe-argument': 'off', // Alerta para argumentos inseguros
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Não força o tipo em funções exportadas
      '@typescript-eslint/no-empty-function': 'off', // Evita funções vazias,
      '@typescript-eslint/no-unsafe-assignment': 'off', // Alerta para atribuições inseguras

      // Outros ajustes
      'no-shadow': 'off', // Evita conflitos com @typescript-eslint
      '@typescript-eslint/no-shadow': 'off', // Reforça a regra para variáveis sombreadas
    },
  },
);
