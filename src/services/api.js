import axios from 'axios'
import router from '@/router/router.js'
import { store } from '@/store/store.js'
import { dispatchEvent } from '@/utils.js'

export const api = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		common: {
			'X-Requested-With': 'XMLHttpRequest'
		}
	}
})

api.interceptors.request.use((config) => {
	dispatchEvent('setLoading', true)
	return config
}, (err) => {
	console.log('err:', err)
	dispatchEvent('setLoading', false)
	let error = err.response?.data
	if (error) {
		dispatchEvent('showMessage', { error: error })
	}
	else
		dispatchEvent('showMessage', { error: 'Erro inesperado' })
	return Promise.reject(err)
})

api.interceptors.response.use((res) => {
	if (store.state.loaderLock != 'on')
		dispatchEvent('setLoading', false)
	return res
}, (err) => {
	console.log('err:', err)
	dispatchEvent('setLoading', false)
	let error = err.response?.data
	if (error && error.message) {
		if (error.message == 'Internal server err - Invalid JWT Token') {
			dispatchEvent('showMessage', 'Sua sessão expirou. Por favor, faça o login novamente')
			router.replace({ name: 'Login' })
		}
		else
			dispatchEvent('showMessage', { error: error.message })
	}
	else if (error) {
		dispatchEvent('showMessage', { error: error })
		console.error(error)
	}
	else
		dispatchEvent('showMessage', { error: 'Erro inesperado' })
	return Promise.reject(err)
})

const configs = () => {
	return {
		headers: {
			Authorization: `Bearer ${ store.state.userProfile.token }`
		}
	}
}

export default {
	login({ email, password }) {
		return api.post('v1/authenticate/login', { email, password })
	},
	getSingers() {
		return api.get('v1/singers/list', configs())
	},
	searchSinger(search) {
		return api.get(`v1/singers/list-by-field?field=${ search }`, configs())
	},
	getSingerById(singerId) {
		return api.get(`v1/singers/details/${ singerId }`, configs())
	},
	getSingerRatings(singerId) {
		return api.get(`v1/singers-rating/singer/${ singerId }`, configs())
	},
	updateSingerData(singerId, data) {
		return api.put(`v1/singers/update/${ singerId }`, data, configs())
	},
	sendRatings(data) {
		return api.post(`v1/singers-rating/create`, data, configs())
	},
	calculateMedia(singerId) {
		return api.get(`v1/singers-rating/calculate-media/${ singerId }`, configs())
	},
	getEvaluatingSinger() {
		return api.get(`v1/singers/list-by-status`, configs())
	},
	getRatedSingers() {
		return api.get(`v1/singers/list-evaluations?status=already_evaluated`, configs())
	},
	getClassifiedSingers() {
		return api.get(`v1/singers/list-evaluations?status=classification`, configs())
	},
	sendEvaluationEmail(singerId) {
		return api.get(`v1/singers/send_evaluation_singer/${ singerId }`, configs())
	},
	generatePDF(ratingIds) {
		return api.post(`v1/singers/generate_pdf`, ratingIds, configs())
	}
}