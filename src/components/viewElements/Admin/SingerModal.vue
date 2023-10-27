<template>
	<div class="singerModalWrapper" :style="{ pointerEvents: singer ? 'all' : 'none' }">
		<transition name="fade">
			<div class="shadow" @click="close" v-if="singer"></div>
		</transition>
		<transition name="grow">
			<div class="singerModal" v-if="singer">
				<Button class="closeBt" @click="close">
					<Icon class="x" :size="1.5" />
				</Button>
				<section>
					<header>
						<h1>{{ singer.artistic_name }}</h1>
						<div class="buttonsWrapper" v-if="singer.evaluation">
							<Button class="headerBt refreshBt" @click="refreshSingerData" v-if="evaluation != 'ALREADY_EVALUATED'" type="submit">
								<Icon class="refresh" :size="1.5" />
							</Button>
							<Button class="headerBt" :disabled="evaluation == 'EVALUATION_AVAILABLE' || evaluation == 'ALREADY_EVALUATED'" @click="permitRatings" type="submit">
								{{ evaluation == 'EVALUATION_AVAILABLE' ? 'Em avaliação' : evaluation == 'ALREADY_EVALUATED' ? 'Já avaliado' : 'Liberar para avaliação' }}
							</Button>
							<Button v-if="evaluation != 'ALREADY_EVALUATED'" class="headerBt" :disabled="ratingsLength < 5" @click="calculateMedia" type="submit">
								Calcular média
							</Button>
							<sup v-if="evaluation == 'EVALUATION_AVAILABLE'">{{ `${ratingsLength == 0 ? 'Nenhuma' : ratingsLength == 1 ? 'Uma' : ratingsLength} avaliaç${ratingsLength > 1 ? 'ões' : 'ão'}` }}</sup>
						</div>
						<div class="buttonsWrapper" v-else>
							<Button class="headerBt" @click="sendEmail" :disabled="singer.singer_status == 'EVALUATION_SENT'" type="submit">
								<div style="display: flex; gap: 7px; align-items: center;">
									<Icon class="mail" :size="1.5" />
									<b>{{ singer.singer_status == 'EVALUATION_SENT' ? 'Email enviado' : 'Enviar email' }}</b>
								</div>
							</Button>
						</div>
					</header>
					<div class="content">
						<hr>
						<div class="flexDiv">
							<div>
								<b>Nome: </b><span>{{ singer.name || singer.singer_name }}</span>
							</div>
							<div v-if="singer.evaluation">
								<b>CPF: </b><span>{{ cpfMask(singer.cpf) }}</span>
							</div>
						</div>
						<div class="flexDiv">
							<div>
								<b>Email: </b><span>{{ singer.email || singer.singer_email }}</span>
							</div>
							<div v-if="singer.evaluation">
								<b>Telefone: </b><span>{{ singer.phone }}</span>
							</div>
						</div>
						<div class="flexDiv" v-if="singer.evaluation">
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
						<div class="flexDiv" v-if="singer.evaluation">
							<div>
								<b>Apresentação: </b><span>{{ singer.presentation_type }}</span>
							</div>
							<div>
								<b>Tom: </b><span>{{ singer.music_type }}</span>
							</div>
						</div>
						<hr v-if="singer.evaluation">
						<div class="flexDiv" v-if="singer.evaluation">
							<div>
								<b>Dados Bancários: </b><span>{{ singer.bank_account }}</span>
							</div>
						</div>
						<hr v-if="singer.averages_ratings">
						<div class="ratings" v-if="singer.averages_ratings">
							<div v-for="(rating, index) in singer.averages_ratings" class="rating">
								<b>{{ ratingNames[index] }}</b><br />
								<span style="font-size: 1.5rem; display: block; text-align: center;">{{ rating.average }}</span>
							</div>
						</div>
					</div>
				</section>
			</div>
		</transition>
	</div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import Button from '@/components/uiElements/Button.vue'
import Icon from '@/components/uiElements/Icon.vue'
import { cpfMask, dispatchEvent } from '@/utils.js'
import api from '@/services/api.js'

const Dialog = inject('Dialog').value
const singer = ref(false)
const evaluation = computed(() => { return singer.value.evaluation })
const ratingsLength = ref(0)
const ratingNames = ['Afinação', 'Interpretação', 'Ritmo', 'Letra', 'Dicção']

function show(newSinger) {
	singer.value = newSinger
	refreshSingerData()
}

function refreshSingerData() {
	if (singer.value.evaluation == 'WAITING_CALL') {
		api.getSingerById(singer.value.id)
			.then((res) => {
				singer.value.evaluation = res.data.evaluation
			})
	}
	else if (singer.value.evaluation == 'EVALUATION_AVAILABLE') {
		api.getSingerRatings(singer.value.id)
			.then((res) => {
				ratingsLength.value = res.data.user_criteria?.length || 0
			})
	}
}

function permitRatings() {
	api.updateSingerData(singer.value.id, {
		evaluation: 'EVALUATION_AVAILABLE'
	})
		.then(() => {
			setTimeout(() => {
				refreshSingerData()
			}, 0)
		})
}

function calculateMedia() {
	api.calculateMedia(singer.value.id)
		.then((res) => {
			Dialog.showMessage(`
				<h1 style="margin-bottom: 17px">Média calculada com sucesso!</h1>
				<div style="display: flex; justify-content: space-evenly; flex-wrap: wrap; gap: 17px; text-align: center;">
					<div>
						<b>Avaliações</b><br/>
						<span style="display: block; margin-top: 7px;">${ res.data.rating_totals }</span>
					</div><br/>
					<div>
						<b>Afinação</b><br/>
						<span style="display: block; margin-top: 7px;">${ res.data.averages[0].average }</span>
					</div>
					<div>
						<b>Interpretação</b><br/>
						<span style="display: block; margin-top: 7px;">${ res.data.averages[1].average }</span>
					</div>
					<div>
						<b>Ritmo</b><br/>
						<span style="display: block; margin-top: 7px;">${ res.data.averages[2].average }</span>
					</div>
					<div>
						<b>Letra</b><br/>
						<span style="display: block; margin-top: 7px;">${ res.data.averages[3].average }</span>
					</div>
					<div>
						<b>Dicção</b><br/>
						<span style="display: block; margin-top: 7px;">${ res.data.averages[4].average }</span>
					</div>
				</div>
			`)
			singer.value.evaluation = 'ALREADY_EVALUATED'
			dispatchEvent('refreshTable')
		})
}

function sendEmail() {
	api.sendEvaluationEmail(singer.value.singer_id)
		.then(() => {
			Dialog.showMessage(`Email enviado com sucesso!`)
			singer.value.singer_status = 'EVALUATION_SENT'
		})
}

function close() {
	singer.value = null
	ratingsLength.value = 0
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
	overflow-y: auto;
	overflow-x: hidden;
}

header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 17px;
	flex-wrap: wrap;
	margin-bottom: 33px;
}

.buttonsWrapper {
	display: flex;
	gap: 7px;
	padding: 0 11px 0 0;
	/* margin-left: auto; */
	position: relative;
}

.headerBt {
	display: grid;
	place-items: center;
	padding: 3px 7px;
}

.buttonsWrapper sup {
	position: absolute;
	top: calc(100% + 3px);
	right: 17px;
	color: var(--danger-light);
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

.ratings {
	margin: 33px 0;
	display: flex;
	gap: 17px;
	flex-wrap: wrap;
	justify-content: center;
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