// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
	rules: {
		'@stylistic/no-tabs': 'off',
		'@stylistic/indent': ['error', 'tab', { SwitchCase: 1 }],
		'@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
		'vue/html-closing': [
			'error',
			{
				'self-closing': 'always',
				'void': 'always',
				'normal': 'never',
				'component': 'always',
			},
		'vue/html-indent': [
			'error',
			'tab',
			{
				attribute: 1,
				baseIndent: 1,
				closeBracket: 0,
				alignAttributesVertically: true,
				ignores: [],
			},
		],
	},
})
