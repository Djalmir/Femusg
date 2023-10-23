import { createStore } from 'vuex'

export const store = createStore({
	state: {
		userProfile: localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')) : null
	},
	mutations: {
		SET_USER_PROFILE(state, userProfile) {
			state.userProfile = userProfile
		}
	},
	actions: {
		setUserProfile({ commit }, userProfile) {
			commit('SET_USER_PROFILE', userProfile)
			if (userProfile)
				localStorage.setItem('userProfile', JSON.stringify(userProfile))
			else
				localStorage.removeItem('userProfile')
		}
	}
})