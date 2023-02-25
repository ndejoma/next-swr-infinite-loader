/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: ['./src/**/*.{js,jsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Satoshi Var', ...defaultTheme.fontFamily.sans],
			},
			colors: {
				primary: '#0C11C0',
			},
			screens: {
				xs: '400px',
			},
		},
	},
};
