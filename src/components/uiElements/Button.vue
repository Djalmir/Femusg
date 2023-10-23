<template>
	<button :disabled="loading">
		<div v-if="loading && type == 'submit'" style="display: flex; align-items: center; justify-content: center; gap: .5rem;">
			<Icon :size="1.25" class="loader" />
			Carregando...
		</div>
		<slot v-else></slot>
	</button>
</template>

<script setup>
import { ref } from 'vue'
import Icon from '@/components/uiElements/Icon.vue'

const props = defineProps({
	type: {
		type: String,
		default: 'button'
	}
})

const loading = ref(false)

document.addEventListener('setLoading', (e) => {
	loading.value = e.detail ? true : false
})
</script>

<style scoped>
button {
	width: fit-content;
	background: linear-gradient(145deg, var(--primary-light), var(--primary));
	color: var(--dark-font2);
	padding: .5rem 1rem;
	border-radius: .3rem;
	cursor: pointer;
	box-shadow: var(--dark-box-shadow);
}

button:hover {
	filter: brightness(1.2);
	box-shadow: var(--hover-dark-box-shadow);
}

button:active {
	filter: brightness(.8);
	box-shadow: var(--inset-dark-box-shadow);
}

/* .light-theme button {
	background-color: var(--secondary);
	color: var(--dark-font1);
	box-shadow: var(--light-box-shadow);
}

.light-theme button:hover {
	filter: brightness(1.2);
	box-shadow: var(--hover-light-box-shadow);
}

.light-theme button:active {
	filter: brightness(.8);
	box-shadow: var(--inset-light-box-shadow);
} */
</style>