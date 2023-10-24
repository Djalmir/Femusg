<template>
	<Table ref="table">
		<template v-slot:headingRow ref="headingRow">
			<div>
				Nome %| CPF %| Nome Artístico %| Música
			</div>
		</template>
		<template v-slot:rows ref="rows">
			<div v-for="singer in singers" :key="singer.id" @click="singerModal.show(singer)">
				{{ singer.name }} %| {{ cpfMask(singer.cpf) }} %| {{ singer.artistic_name }} %| {{ singer.song_name }}
			</div>
		</template>
	</Table>
	<transition name="roll">
		<div class="searchDiv" v-if="scrolledUp" @keyup.enter="handleEnterKey">
			<Input type="search" placeholder="Pesquisa" style="flex: 1;" v-model="search" :value="search" />
			<Button class="searchBt" ref="searchBt" @click="searchSinger">
				<Icon :size="1.5" class="search" />
			</Button>
		</div>
	</transition>
	<SingerModal ref="singerModal" />
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import Table from '@/components/uiElements/Table.vue'
import Input from '@/components/formElements/Input.vue'
import Button from '@/components/uiElements/Button.vue'
import Icon from '@/components/uiElements/Icon.vue'
import SingerModal from '@/components/viewElements/Admin/SingerModal.vue'
import api from '@/services/api.js'
import { cpfMask } from '@/utils.js'

const table = ref()
const singerModal = ref()
const singers = ref([])
const search = ref('')
const searchBt = ref()
const Dialog = inject('Dialog').value

const scrolledUp = ref(true)
const lastScroll = ref(0)
onMounted(() => {
	getSingers()
		.then(() => {
			setTimeout(() => {
				let tableWrapper = document.querySelector('.tableWrapper')
				tableWrapper.addEventListener('scroll', () => {
					if (tableWrapper.scrollTop > lastScroll.value + 50) {
						scrolledUp.value = false
						lastScroll.value = tableWrapper.scrollTop
					}
					else if (tableWrapper.scrollTop < lastScroll.value - 50) {
						scrolledUp.value = true
						lastScroll.value = tableWrapper.scrollTop
					}
				})
			}, 0)
		})
	document.addEventListener('refreshTable', () => {
		getSingers()
			.then(() => {
				table.value.refresh()
			})
	})
})

async function getSingers() {
	singers.value = []
	await api.getSingers()
		.then((res) => {
			singers.value = res.data
		})
}

async function searchSinger() {
	singers.value = []
	await api.searchSinger(search.value)
		.then((res) => {
			singers.value = res.data
			if (!singers.value.length) {
				Dialog.showMessage('<b>Nenhum resultado encontrado</b>')
				getSingers()
					.then(() => {
						table.value.refresh()
					})
			}
			else
				setTimeout(() => {
					table.value.refresh()
				}, 0)
		})
}

function handleEnterKey() {
	searchSinger()
	document.querySelector('.searchBt').focus()
}

</script>

<style scoped>
.searchDiv {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 7px;
	background: linear-gradient(145deg, var(--dark-bg3), var(--dark-bg1));
	position: fixed;
	bottom: 0px;
	right: 0px;
	width: 90vw;
	max-width: 480px;
	padding: 7px 17px 17px 7px;
	border-radius: .5rem 0 0 0;
	box-shadow: -1px -1px 2px var(--dark-bg1);
}

.light-theme .searchDiv {
	background: linear-gradient(145deg, var(--light-bg3), var(--light-bg1));
	box-shadow: -1px -1px 2px var(--light-bg1);
}

.searchDiv label {
	padding: 0;
	margin: 0;
}

.searchDiv button {
	border-radius: 50%;
	display: grid;
	place-items: center;
	padding: 7px;
	background: linear-gradient(145deg, var(--primary-light), var(--primary));
}

.roll-enter-from,
.roll-leave-to {
	transform: translateY(100%);
}

.roll-enter-active,
.roll-leave-active {
	transition: linear .1s;
}
</style>