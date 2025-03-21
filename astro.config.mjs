// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: '智晦',
			defaultLocale: 'zh-CN',
			routeMiddleware: './src/middleware/routeMiddleware.ts',
			social: {
				// email: 'mailto:hanjianqiao@gmail.com',
			},
			components: {
				// Footer: './src/components/Footer.astro',
			},
			sidebar: [
				{
					label: '捐赠支持',
					autogenerate: { directory: 'sponsor' },
				},
			],
		}),
	],
});
