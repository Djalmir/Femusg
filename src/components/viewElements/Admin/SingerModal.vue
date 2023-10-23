<template>
	<div class="singerModalWrapper" :style="{ pointerEvents: singer ? 'all' : 'none' }">
		<transition name="fade">
			<div class="shadow" @click="singer = null" v-if="singer"></div>
		</transition>
		<transition name="grow">
			<div class="singerModal" v-if="singer">
				<Button class="closeBt" @click="singer = null">
					<Icon class="x" :size="1.5" />
				</Button>
				<section>
					<h1>{{ singer.artistic_name }}</h1>
					<div class="content">
						<hr>
						<div class="flexDiv">
							<div>
								<b>Nome: </b><span>{{ singer.name }}</span>
							</div>
							<div>
								<b>CPF: </b><span>{{ cpfMask(singer.cpf) }}</span>
							</div>
						</div>
						<div class="flexDiv">
							<div>
								<b>Email: </b><span>{{ singer.email }}</span>
							</div>
							<div>
								<b>Telefone: </b><span>{{ singer.phone }}</span>
							</div>
						</div>
						<div class="flexDiv">
							<div>
								<b>Endereço: </b><span>{{ singer.address }}</span>
							</div>
							<div>
								<b>Youtube: </b><a :href="singer.youtube_link" target="_blank">Acessar link</a>
							</div>
						</div>
						<hr>
						<div class="flexDiv">
							<div>
								<b>Música: </b><span>{{ singer.song_name }}</span>
							</div>
						</div>
						<div class="flexDiv">
							<div>
								<b>Apresentação: </b><span>{{ singer.presentation_type }}</span>
							</div>
							<div>
								<b>Tom: </b><span>{{ singer.music_type }}</span>
							</div>
						</div>
						<hr>
						<div class="flexDiv">
							<div>
								<b>Dados Bancários: </b><span>{{ singer.bank_account }}</span>
							</div>
						</div>
					</div>
				</section>
			</div>
		</transition>
	</div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@/components/uiElements/Button.vue'
import Icon from '@/components/uiElements/Icon.vue'
import { cpfMask } from '@/utils.js'

const singer = ref(false)

function show(newSinger) {
	console.log(newSinger)
	singer.value = newSinger
}

defineExpose({
	show
})
</script>

<style scoped>
.singerModalWrapper {
	position: fixed;
	inset: 0;
	z-index: 5;
	display: grid;
	place-items: center;
}

.shadow {
	width: 100%;
	height: 100vh;
	background: linear-gradient(145deg, var(--dark-bg1-transparent), var(--dark-bg1));
}

.light-theme .shadow {
	background: linear-gradient(145deg, var(--dark-bg2-transparent), var(--light-bg1-transparent));
}

.singerModal {
	background: linear-gradient(145deg, var(--dark-bg3), var(--dark-bg1));
	border-radius: .5rem;
	z-index: 1;
	width: 90vw;
	max-width: 800px;
	height: 380px;
	max-height: 80vh;
	padding: 33px 17px 17px;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) scale(1);
	box-shadow: var(--dark-box-shadow);
}

.light-theme .singerModal {
	background: linear-gradient(145deg, var(--light-bg3), var(--light-bg1));
	box-shadow: var(--light-box-shadow);
}

.closeBt {
	position: absolute;
	top: 0px;
	right: 0px;
	transform: translate(17%, -17%);
	background: linear-gradient(145deg, var(--dark-bg3), var(--dark-bg2));
	color: var(--danger-light);
	padding: 2px;
	display: grid;
	place-items: center;
}

.light-theme .closeBt {
	background: linear-gradient(145deg, var(--light-bg3), var(--light-bg1));
	color: var(--danger);
}

section {
	height: 100%;
	overflow: auto;
}

.content {
	padding: 0 7px;
}

.flexDiv {
	display: flex;
	gap: 13px 33px;
	flex-wrap: wrap;
	align-items: flex-start;
	justify-content: space-between;
	margin: 13px 0;
}

.flexDiv>div {
	flex: 1;
	min-width: 240px;
	text-align: left;
}

a {
	color: var(--primary-light);
}

a:active {
	color: var(--primary);
}

a:visited {
	color: var(--success);
}

hr {
	border: none;
	border-bottom: 1px solid var(--dark-bg1-transparent);
	margin: 17px 0 7px;
}

.light-theme hr {
	border-bottom: 1px solid var(--light-bg1-transparent);
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
	transition: ease-in .1s;
}

.grow-enter-from,
.grow-leave-to {
	transform: translate(-50%, -50%) scale(.7);
	opacity: 0;
}

.grow-enter-active,
.grow-leave-active {
	transition: ease-in .2s;
}
</style>