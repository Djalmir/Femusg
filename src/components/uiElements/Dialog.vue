<template>
	<div class="dialogWrapper" :style="{ pointerEvents: showing ? 'all' : 'none' }">
		<transition name="fade">
			<div class="dialogShadow" v-if="showing" @click="close"></div>
		</transition>
		<transition name="roll">
			<Message class="dialog" v-if="showing == 'message'" :message="message" @close="close"/>
			<Confirm class="dialog" v-else-if="showing == 'confirm'" :message="message" @close="close"/>
		</transition>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import Message from '@/components/componentElements/Dialog/Message.vue'
import Confirm from '@/components/componentElements/Dialog/Confirm.vue'

const showing = ref(null)
const message = ref(null)

function showMessage(msg) {
	showing.value = 'message'
	message.value = msg
}

function confirm(msg) {
	showing.value = 'confirm'
	message.value = msg
}

function close() {
	showing.value = null
	message.value = null
}

defineExpose({
	showMessage,
	confirm
})

</script>

<style scoped>
.dialogWrapper {
	position: fixed;
	inset: 0;
	display: grid;
	place-items: center;
	z-index: 5;
}

.dialogShadow {
	width: 100%;
	height: 100vh;
	background-color: rgba(0, 0, 0, .5);
}


.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
	transition: ease-in .2s;
}

.roll-enter-from,
.roll-leave-to {
	transform: translateY(-200%);
}

.roll-enter-active,
.roll-leave-active {
	transition: ease-in .3s;
}
</style>