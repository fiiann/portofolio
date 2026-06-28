import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	integrations: [tailwind()],
	site: 'https://garfianto.web.id',
	base: '/',
	vite: {
		preview: {
			allowedHosts: ['garfianto.web.id'],
		},
	},
});
