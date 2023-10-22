<template>
	<transition name="dropDownAnimation">
		<div v-if="showing" class="dropdown" ref="dropdown">
			<ul>
				<li v-for="item in list" @click="item.action()">
					<div v-if="item.leftComponent">
						<Icon v-if="item.leftComponent == 'Icon'" :class="item.class" />
						<Switch v-else-if="item.leftComponent == 'Switch'" :model-value="item.vModel" :leftIcon="item.leftIcon" :rightIcon="item.rightIcon" @click.stop />
					</div>
					{{ item.label }}
					<div v-if="item.rightComponent">
						<Icon v-if="item.rightComponent == 'Icon'" :class="item.class" />
						<Switch v-else-if="item.rightComponent == 'Switch'" :model-value="item.vModel" :leftIcon="item.leftIcon" :rightIcon="item.rightIcon" @click.stop />
					</div>
				</li>
			</ul>
		</div>
	</transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import Icon from '@/components/uiElements/Icon.vue'
import Switch from '@/components/formElements/Switch.vue'

const dropdown = ref()
const props = defineProps(['list'])
const showing = ref(false)
const transformOrigin = ref('left')

function toggleShowing(coordinates, align) {
	showing.value = !showing.value
	if (showing.value) {
		show(coordinates, align)
	}
	else {
		hide()
	}
}

function show(coordinates, align) {
	transformOrigin.value = `top ${ align }`
	showing.value = true
	setTimeout(() => {
		dropdown.value.style.top = coordinates.y + coordinates.height + 3 + 'px'
		dropdown.value.style.left = coordinates.x - (align == 'right' ? (dropdown.value.offsetWidth - coordinates.width) : align == 'center' ? dropdown.value.offsetWidth / 2 : 0) + 'px'
		document.addEventListener('click', hideIfOutside)
	}, 0)
}

function hideIfOutside(e) {
	if (!dropdown.value?.contains(e.target)) {
		hide()
	}
}

function hide() {
	showing.value = false
	document.removeEventListener('click', hideIfOutside)
}

defineExpose({ toggleShowing, show, hide })
</script>

<style scoped>
.dropdown {
	position: absolute;
	width: 90%;
	max-width: 220px;
	background: linear-gradient(145deg, var(--dark-bg3), var(--dark-bg2));
	list-style: none;
	padding: 7px 0;
	border-radius: .3rem;
	box-shadow: var(--dark-box-shadow);
	display: flex;
	flex-direction: column;
	z-index: 1;
	transition: transform .2s, opacity .2s;
	transform-origin: v-bind(transformOrigin);
}

.light-theme .dropdown {
	background: linear-gradient(145deg, var(--light-bg3), var(--light-bg2));
}

li {
	padding: 7px 17px;
	cursor: pointer;
	display: flex;
	gap: 7px;
	align-items: center;
	justify-content: space-between;
}

li:hover {
	background: linear-gradient(145deg, var(--dark-bg2), var(--dark-bg1));
}

.light-theme li:hover {
	background: linear-gradient(145deg, var(--light-bg2), var(--light-bg1));
}

li:active {
	filter: brightness(.8);
}

.dropDownAnimation-enter-from,
.dropDownAnimation-leave-to {
	opacity: 0;
	transform: scale(0);
}
</style>