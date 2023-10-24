<template>
	<div class="wrapper">
		<section v-if="singer">
			<h1>{{ singer.artistic_name }}</h1>
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
				<b style="font-size: 1.2rem;margin-top: 17px; display: block;">Avaliações</b>
				<div class="ratingsWrapper">
					<div>
						<b>Afinação</b>
						<div class="rating">
							<NumberRoulette :showTen="true" />,
							<NumberRoulette />
							<NumberRoulette />
						</div>
					</div>
					<div>
						<b>Interpretação</b>
						<div class="rating">
							<NumberRoulette :showTen="true" />,
							<NumberRoulette />
							<NumberRoulette />
						</div>
					</div>
					<div>
						<b>Ritmo</b>
						<div class="rating">
							<NumberRoulette :showTen="true" />,
							<NumberRoulette />
							<NumberRoulette />
						</div>
					</div>
					<div>
						<b>Letra</b>
						<div class="rating">
							<NumberRoulette :showTen="true" />,
							<NumberRoulette />
							<NumberRoulette />
						</div>
					</div>
					<div>
						<b>Dicção</b>
						<div class="rating">
							<NumberRoulette :showTen="true" />,
							<NumberRoulette />
							<NumberRoulette />
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api.js'
import NumberRoulette from '@/components/formElements/NumberRoulette.vue'

const singer = ref(null)
onMounted(() => {
	getSinger()
	document.addEventListener('refreshTable', getSinger)
})

function getSinger() {
	singer.value = null
	api.getSingers()
		.then((res) => {
			singer.value = res.data.find(s => s.evaluation == 'EVALUATION_AVAILABLE')
		})
}
</script>

<style scoped>
.wrapper {
	position: absolute;
	inset: 0;
	display: grid;
	place-items: center;
}

section {
	width: 90vw;
	max-width: 1024px;
	height: 380px;
	max-height: 80vh;
	overflow-y: auto;
	overflow-x: hidden;
	border-radius: .5rem;
	padding: 17px;
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
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 17px 7px;
	margin-top: 17px;
}

.ratingsWrapper>div {
	flex: 1;
	width: 100%;
	text-align: center;
	position: relative;
}

.rating {
	margin-top: 7px;
	text-align: left;
	width: 100%;
	height: 72px;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 7px;
}
</style>