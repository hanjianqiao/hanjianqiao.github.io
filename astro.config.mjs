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
				email: 'mailto:lanchitour@gmail.com',
			},
			components: {
				PageFrame: './src/components/PageFrame.astro',
			},
			sidebar: [
				{
					label: '捐赠支持',
					autogenerate: { directory: 'sponsor' },
				},
				{
					label: '密码与密码运算',
					autogenerate: { directory: 'cryptography' },
				},
				{
					label: '操作系统',
					autogenerate: { directory: 'operating_systems' },
				},
				{
					label: '实践杂谈',
					autogenerate: { directory: 'practical_talk' },
				},
			],
		}),
	],
});
