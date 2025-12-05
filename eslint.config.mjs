import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	// Override default ignores of eslint-config-next.
	globalIgnores([
		// Default ignores of eslint-config-next:
		'.next/**',
		'out/**',
		'build/**',
		'next-env.d.ts',
		'node_modules/',
	]),
	prettierConfig,
	{
		plugins: {
			prettier: prettierPlugin,
		},
		settings: {
			'import/resolver': {
				typescript: {
					alwaysTryTypes: true,
					project: './tsconfig.json',
				},
			},
		},
		rules: {
			'react/react-in-jsx-scope': 'off',
			'react-hooks/exhaustive-deps': 'off',
			'prettier/prettier': [
				'error',
				{
					endOfLine: 'auto',
				},
			],
			'import/order': [
				'error',
				{
					groups: [
						'builtin',
						'external',
						'internal',
						['parent', 'sibling'],
						'index',
						'object',
						'type',
					],
					pathGroups: [
						{
							pattern: 'react',
							group: 'builtin',
							position: 'before',
						},
						{
							pattern: 'next/**',
							group: 'builtin',
							position: 'before',
						},
						{
							pattern: '@/**',
							group: 'internal',
							position: 'after',
						},
					],
					pathGroupsExcludedImportTypes: ['react', 'next'],
					'newlines-between': 'always',
					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
				},
			],
			'import/no-unresolved': 'error',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': 'error',
		},
	},
]);

export default eslintConfig;
