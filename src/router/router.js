import { createRouter, createWebHistory } from 'vue-router'
import { store } from '@/store/store.js'
import Login from '@/views/Login.vue'

const routes = [
	{
		path: '/',
		name: 'Login',
		component: Login
	},
	{
		path: '/admin',
		name: 'Admin',
		component: () => import('@/views/Admin.vue')
	},
	{
		path: '/evaluator',
		name: 'Evaluator',
		component: () => import('@/views/Evaluator.vue')
	},

	{
		path: '/:pathMatch(.*)',
		component: Login
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

export default router