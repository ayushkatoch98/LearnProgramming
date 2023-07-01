/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
        'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
	],
	theme: {
		extend: {
			accentColor: "#ff0000",
			colors: {
				accent: "#112327",
				background: "#111827",
				border: "#1f2937"
			},
		},
		accentColor: "#ff0000",
		primary: "#ff0000"

	},
	plugins: [require('flowbite/plugin')],
}

