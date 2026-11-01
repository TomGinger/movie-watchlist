import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
	base: './',
	plugins: [],
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				watchlist: resolve(__dirname, 'watch-list.html'),
			},
		},
	},
})
