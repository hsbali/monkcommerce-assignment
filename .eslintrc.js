module.exports = {
	env: {
		browser: true,
		es2021: true,
		jest: true,
	},
	extends: ['airbnb', 'plugin:react/recommended', 'prettier'],
	plugins: ['react', 'prettier', 'react-hooks', '@typescript-eslint'],
	rules: {
		'import/extensions': 'off',
		'react/jsx-props-no-spreading': 'off',
		'react/react-in-jsx-scope': 0,
		'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
		'prettier/prettier': [
			2,
			{
				printWidth: 140,
				useTabs: true,
				tabWidth: 4,
				semi: true,
				singleQuote: true,
				bracketSpacing: true,
				bracketSameLine: false,
				arrowParens: 'always',
				endOfLine: 'auto',
			},
		],
	},
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			rules: {
				'no-undef': 'off',
			},
		},
	],
	settings: {
		react: {
			version: 'detect',
		},
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			},
		},
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
};
