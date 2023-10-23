<template>
	<section>
		<form action="javascript:void(0)" @submit="login">
			<h2>Login</h2>
			<Input class="input" type="email" label="Email" v-model="email" required />
			<Input class="input" type="password" label="Senha" v-model="password" required />
			<Button class="submitBt" type="submit">Entrar</Button>
		</form>
		<!-- <Button @click="Dialog.showMessage('<h1>Teste</h1>')">Teste</Button> -->
	</section>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Input from '@/components/formElements/Input.vue'
import Button from '@/components/uiElements/Button.vue'
import api from '@/services/api.js'
const store = useStore()
const router = useRouter()

const Dialog = inject('Dialog').value

const email = ref('')
const password = ref('')

onMounted(() => {
	if (store.state.userProfile) {
		switch (store.state.userProfile.profile) {
			case 'evaluator':
				router.push({ name: 'Evaluator' })
				break
			case 'admin':
				router.push({ name: 'Admin' })
				break
		}
	}
})

function login() {
	api.login({
		email: email.value,
		password: password.value
	})
		.then((res) => {
			let userProfile = {
				token: res.data.token,
				refreshToken: res.data.refreshToken,
				...res.data.user
			}
			store.dispatch('setUserProfile', userProfile)
			switch (userProfile.profile) {
				case 'evaluator':
					router.push({ name: 'Evaluator' })
					break
				case 'admin':
					router.push({ name: 'Admin' })
					break

			}
		})
}
</script>

<style scoped>
section {
	position: absolute;
	inset: 70px 17px 17px;
	display: grid;
	place-items: center;
	padding: 23px 17px 127px;
}

form {
	background: linear-gradient(145deg, var(--dark-bg3), var(--dark-bg2));
	padding: 17px;
	border-radius: .3rem;
	box-shadow: var(--dark-box-shadow);
	width: 90%;
	max-width: 380px;
}

.light-theme form {
	background: linear-gradient(145deg, var(--light-bg3), var(--light-bg2));
	box-shadow: var(--light-box-shadow);
}

h2 {
	text-align: center;
}

.input {
	width: 100%;
}

.submitBt {
	width: 100%;
	margin-top: 7px;
	height: 39px;
	font-weight: bold;
}
</style>