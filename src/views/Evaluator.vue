<template>
	<div class="wrapper">
		<section v-if="singer">
			<h1 style="font-size: 1.7rem;">{{ singer.artistic_name }}</h1>
			<hr>
			<div class="content">
				<div class="flexDiv">
					<div>
						<b>Nome: </b><span>{{ singer.name }}</span>
					</div>
					<div>
						<b>Apresentação: </b><span>{{ singer.presentation_type }}</span>
					</div>
				</div>
				<div class="flexDiv">
					<div>
						<b>Música: </b><span>{{ singer.song_name }}</span>
					</div>
					<div>
						<b>Tom: </b><span>{{ singer.music_type }}</span>
					</div>
				</div>
				<hr>
				<b style="font-size: 1.25rem; margin-top: 37px; display: block; text-align: center;">Avaliações</b>
				<div class="ratingsWrapper" ref="ratingsWrapper">
					<div class="ratings">
						<div v-for="rating in Object.entries(ratings.value)" class="rating">
							<b>{{ rating[1].label }}</b>
							<Input inputmode="numeric" class="rate" v-model="rating[1].rate" style="font-size: 1.5rem; text-align: center;" @input="(e) => rateMask(e, rating[1], 'rate')" placeholder="__,__" @focus="autoSelect" />
						</div>
					</div>
				</div>
				<Button class="sendRaingsBt" @click="evaluate" :disabled="singer.evaluated">{{ singer.evaluated ? 'Sua avaliação já foi enviada' : 'Enviar Avaliações' }}</Button>
			</div>
		</section>
		<div v-else-if="loading" class="loaderWrapper">
			<div class="loaderDiv">
				<Icon class="loader" :size="2" />
				Carregando...
			</div>
		</div>
		<div v-else class="noSingerAvailable">
			<b>Nenhum cantor disponível para avaliação</b>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted, inject, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Button from '@/components/uiElements/Button.vue'
import Input from '@/components/formElements/Input.vue'
import Icon from '@/components/uiElements/Icon.vue'
import api from '@/services/api.js'
import { rateMask } from '@/utils.js'

const Dialog = inject('Dialog').value
const loading = ref(true)
const store = useStore()
const router = useRouter()
const singer = ref(null)
const cleanRatings = JSON.stringify({
	tuning: {
		label: 'Afinação',
		rate: ''
	},
	interpretation: {
		label: 'Interpretação',
		rate: ''
	},
	rhythm: {
		label: 'Ritmo',
		rate: ''
	},
	letter: {
		label: 'Letra',
		rate: ''
	},
	diction: {
		label: 'Dicção',
		rate: ''
	}
})
const ratings = reactive({
	value: JSON.parse(cleanRatings)
})
const ratingsWrapper = ref()

onMounted(() => {
	if (store.state.userProfile.profile != 'evaluator')
		router.replace({ name: 'Login' })
	else {
		getSinger()
		document.addEventListener('refreshTable', getSinger)
	}
})

function getSinger() {
	loading.value = true
	singer.value = null
	ratings.value = JSON.parse(cleanRatings)
	api.getSingers()
		.then((res) => {
			singer.value = res.data.find(s => s.evaluation == 'EVALUATION_AVAILABLE')
			loading.value = false
			if (singer.value) {
				api.getEvaluatingSinger()
					.then((res) => {
						singer.value.evaluated = res.data
					})
			}
		})
}

async function evaluate() {
	let allDone = true
	for (const [key, value] of Object.entries(ratings.value)) {
		if (value.rate == '') {
			allDone = false
		}
	}
	if (!allDone) {
		return Dialog.showMessage('<b style="font-size: 1.25rem;">Por favor, preencha todas as avaliações.</b>')
	}
	else if (await Dialog.confirm(`
		<h1 style="margin-bottom: 17px">Confirma as avaliações?</h1>
		<div style="display: flex; justify-content: space-evenly; flex-wrap: wrap; gap: 17px; text-align: center;">
			<div>
				<b>Afinação</b><br/>
				<span style="display: block; margin-top: 7px;">${ ratings.value.tuning.rate }</span>
			</div>
			<div>
				<b>Interpretação</b><br/>
				<span style="display: block; margin-top: 7px;">${ ratings.value.interpretation.rate }</span>
			</div>
			<div>
				<b>Ritmo</b><br/>
				<span style="display: block; margin-top: 7px;">${ ratings.value.rhythm.rate }</span>
			</div>
			<div>
				<b>Letra</b><br/>
				<span style="display: block; margin-top: 7px;">${ ratings.value.letter.rate }</span>
			</div>
			<div>
				<b>Dicção</b><br/>
				<span style="display: block; margin-top: 7px;">${ ratings.value.diction.rate }</span>
			</div>
		</div>
	`)) {
		api.sendRatings({
			"singer_id": singer.value.id,
			"criteria": [
				{
					"criterion_id": 1,
					"rating": Number(ratings.value.tuning.rate.replace(',', '.'))
				},
				{
					"criterion_id": 2,
					"rating": Number(ratings.value.interpretation.rate.replace(',', '.'))
				},
				{
					"criterion_id": 3,
					"rating": Number(ratings.value.rhythm.rate.replace(',', '.'))
				},
				{
					"criterion_id": 4,
					"rating": Number(ratings.value.letter.rate.replace(',', '.'))
				},
				{
					"criterion_id": 5,
					"rating": Number(ratings.value.diction.rate.replace(',', '.'))
				}
			]

		})
			.then(() => {
				Dialog.showMessage('Avaliações enviadas com sucesso')
				getSinger()
			})
	}
}

function autoSelect(e) {
	e.target.select()
}

onBeforeUnmount(() => {
	document.removeEventListener('refreshTable', getSinger)
})

</script>

<style scoped>
section {
	width: 90vw;
	max-width: 1980px;
	max-height: 85vh;
	overflow-y: auto;
	overflow-x: hidden;
	border-radius: .5rem;
	padding: 17px;
	margin: 33px auto 0;
	background: linear-gradient(145deg, var(--dark-bg3), var(--dark-bg1));
	box-shadow: var(--dark-box-shadow);
}

.light-theme section {
	background: linear-gradient(145deg, var(--light-bg3), var(--light-bg1));
	box-shadow: var(--light-box-shadow);
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

.ratingsWrapper {
	margin: 17px auto;
	overflow: auto;
	border-radius: .3rem;
	background: linear-gradient(145deg, var(--dark-bg2-transparent), var(--dark-bg1));
	box-shadow: inset 0 0 3px #000000d0;
	position: relative;
	display: flex;
	max-width: fit-content;
}

.light-theme .ratingsWrapper {
	background: linear-gradient(145deg, var(--light-bg2-transparent), var(--light-bg1));
}

.scrollBt {
	position: sticky;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1;
}

.ratings {
	width: fit-content;
	display: flex;
	justify-content: space-evenly;
	padding: 17px 33px;
	gap: 0 33px;
	width: fit-content;
	position: relative;
}

.rating {
	width: 140px;
	text-align: center;
	font-size: 1.1rem;
}

.rate {
	margin-top: 7px;
	width: 100%;
}

.loaderWrapper,
.noSingerAvailable {
	position: absolute;
	inset: 0;
	display: grid;
	place-items: center;
}

.loaderDiv {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: .5rem;
	width: fit-content;
}

.sendRaingsBt {
	width: 100%;
	max-width: 480px;
	display: block;
	margin: 17px auto;
}
</style>