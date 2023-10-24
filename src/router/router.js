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
		component: () => import('@/views/Admin.vue'),
		authRequired: true
	},
	{
		path: '/evaluator',
		name: 'Evaluator',
		component: () => import('@/views/Evaluator.vue'),
		authRequired: true
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

function isAuthenticated() {
	return store.state.userProfile
}

router.beforeEach((to, from, next) => {
	console.log(to)
	to.authRequired = routes.find((route) => route.name == to.name).authRequired
	if (to.authRequired && !isAuthenticated()) next({ name: 'Login' })
	else next()
})

export default router