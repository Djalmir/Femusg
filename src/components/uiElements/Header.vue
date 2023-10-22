<template>
	<header>
		<img src="/galvao.png" alt="Brasão de Galvão" class="logo" />
		<h1>Femusg</h1>
		<Button class="settingsBt" style="margin-left: auto;" @click="e => { dropdown.toggleShowing(e.target.getBoundingClientRect(), 'right') }">
			<Icon class="more-vertical" :size="1.25" style="pointer-events: none;" />
		</Button>
		<!-- <Switch v-model="darkTheme" leftIcon="moon" rightIcon="sun" /> -->
	</header>
	<DropDown :list="dropdownList" ref="dropdown" />
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import Button from '@/components/uiElements/Button.vue'
import Switch from '@/components/formElements/Switch.vue'
import Icon from '@/components/uiElements/Icon.vue'
import DropDown from '@/components/uiElements/DropDown.vue'

const darkTheme = ref(window.matchMedia("(prefers-color-scheme: dark)").matches)
const emit = defineEmits(['toggleTheme'])

watch(darkTheme, () => {
	emit('toggleTheme')
})

const dropdown = ref()
const dropdownList = [
	{
		label: 'Tema',
		rightComponent: 'Switch',
		leftIcon: 'moon',
		rightIcon: 'sun',
		vModel: darkTheme,
		action: () => {
			darkTheme.value = !darkTheme.value
		}
	},
	{
		label: 'Sair',
		rightComponent: 'Icon',
		class: 'logout',
		action: () => {
			console.log('sair')
		}
	}
]



</script>

<style scoped>
header {
	background: linear-gradient(145deg, var(--dark-bg3-transparent), var(--dark-bg2-transparent));
	width: 100%;
	padding: 7px 17px;
	box-shadow: var(--dark-box-shadow);
	display: flex;
	align-items: center;
	gap: 17px;
	backdrop-filter: blur(10px);
}

.logo {
	display: block;
	height: 48px;
	width: 48px;
	-webkit-user-drag: none;
}

.light-theme header {
	background: linear-gradient(145deg, var(--light-bg3-transparent), var(--light-bg2-transparent));
	box-shadow: var(--light-box-shadow);
}

.settingsBt {
	border-radius: 50%;
	width: 37px;
	height: 37px;
	display: grid;
	place-items: center;
	padding: 0;
	background: linear-gradient(145deg, var(--dark-bg3), var(--dark-bg2));
}

.light-theme .settingsBt {
	background: linear-gradient(145deg, var(--light-bg3), var(--light-bg2));
	color: var(--light-font2);
}
</style>