<template>
	<Header @toggleTheme="changeTheme" />
	<router-view />
	<Dialog ref="dialog" />
</template>

<script setup>
import { onMounted, ref, provide } from 'vue'
import Header from '@/components/uiElements/Header.vue'
import Dialog from '@/components/uiElements/Dialog.vue'

const dialog = ref()
provide('Dialog', dialog)

document.addEventListener('showMessage', showMessage)

onMounted(() => {
	if (window.matchMedia("(prefers-color-scheme: light)").matches) {
		changeTheme()
	}
})

function showMessage(msg) {
	dialog.value.showMessage(msg.detail.error ? `<b class="errorMessage">${ msg.detail.error }</b>` : msg.detail.success ? `<b class="successMessage">${ msg.detail.success }</b>` : msg.detail)
}

function changeTheme() {
	if (Array.from(document.documentElement.classList).includes('light-theme')) {
		document.documentElement.classList.replace('light-theme', 'dark-theme')
	}
	else
		document.documentElement.classList.replace('dark-theme', 'light-theme')
}
</script>

<style scoped>
.errorMessage {
	color: var(--danger) !important;
}

.successMessage {
	color: var(--success) !important;
}
</style>