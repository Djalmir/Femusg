<template>
	<nav>
		<div class="buttonsWrapper">
			<Button :class="`tabBt ${currentView == 0 ? 'active' : ''}`" @click="goToView(0)">Inscritos</Button>
			<Button :class="`tabBt ${currentView == 1 ? 'active' : ''}`" @click="goToView(1)">Avaliados</Button>
			<Button :class="`tabBt ${currentView == 2 ? 'active' : ''}`" @click="goToView(2)">Classificados</Button>
		</div>
	</nav>
	<Table ref="table0" v-if="currentView == 0">
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
	<Table ref="table1" v-else-if="currentView == 1" templateColumns="minmax(220px, 1fr) minmax(220px, 1fr) minmax(220px, 1fr) 170px">
		<template v-slot:headingRow>
			<div>
				Nome %| Nome Artístico %| Música %| Total das médias
			</div>
		</template>
		<template v-slot:rows>
			<div v-for="singer in singers" :key="singer.id" @click="singerModal.show(singer)">
				{{ singer.singer_name }} %| {{ singer.artistic_name }} %| {{ singer.song_name }} %| {{ singer.average }}
			</div>
		</template>
	</Table>
	<Table ref="table2" v-else-if="currentView == 2" templateColumns="minmax(220px, 1fr) minmax(220px, 1fr) minmax(220px, 1fr) 170px">
		<template v-slot:headingRow>
			<div>
				Nome %| Nome Artístico %| Música %| Total das médias
			</div>
		</template>
		<template v-slot:rows>
			<div v-for="singer in singers" :key="singer.id" @click="singerModal.show(singer)">
				{{ singer.singer_name }} %| {{ singer.artistic_name }} %| {{ singer.song_name }} %| {{ singer.average }}
			</div>
		</template>
	</Table>
	<transition name="roll">
		<div class="searchDiv" v-if="scrolledUp && currentView == 0" @keyup.enter="handleEnterKey">
			<Input type="search" placeholder="Pesquisa" style="flex: 1;" v-model="search" :value="search" />
			<Button class="searchBt" ref="searchBt" @click="searchSinger">
				<Icon :size="1.5" class="search" />
			</Button>
		</div>
	</transition>
	<SingerModal ref="singerModal" />
</template>

<script setup>
import { ref, onMounted, inject, computed, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Table from '@/components/uiElements/Table.vue'
import Input from '@/components/formElements/Input.vue'
import Button from '@/components/uiElements/Button.vue'
import Icon from '@/components/uiElements/Icon.vue'
import SingerModal from '@/components/viewElements/Admin/SingerModal.vue'
import api from '@/services/api.js'
import { cpfMask } from '@/utils.js'

const table0 = ref()
const table1 = ref()
const table2 = ref()
const singerModal = ref()
const singers = ref([])
const search = ref('')
const searchBt = ref()
const Dialog = inject('Dialog').value
const store = useStore()
const router = useRouter()
const currentView = ref(0)

const scrolledUp = ref(true)
const lastScroll = ref(0)
const navTop = computed(() => { return scrolledUp.value ? '62px' : '0' })
onMounted(() => {
	if (store.state.userProfile.profile != 'admin')
		router.replace({ name: 'Login' })
	else {
		getSingers()
	}
	document.addEventListener('refreshTable', handleRefreshTable)
})

function setTableWrapperScroll() {
	let tableWrapper = document.querySelector('.tableWrapper')
	tableWrapper.onscroll = () => {
		if (tableWrapper.scrollTop > lastScroll.value + 50) {
			scrolledUp.value = false
			lastScroll.value = tableWrapper.scrollTop
		}
		else if (tableWrapper.scrollTop < lastScroll.value - 50) {
			scrolledUp.value = true
			lastScroll.value = tableWrapper.scrollTop
		}
	}
}

async function getSingers() {
	singers.value = []
	await api.getSingers()
		.then((res) => {
			singers.value = res.data
			setTimeout(() => {
				setTableWrapperScroll()
				table0.value.refresh()
			}, 0)

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
			}
			else
				setTimeout(() => {
					table0.value.refresh()
				}, 0)
		})
}

async function getRatedSingers() {
	singers.value = []
	await api.getRatedSingers()
		.then((res) => {
			singers.value = res.data
			setTimeout(() => {
				setTableWrapperScroll()
				table1.value.refresh()
			}, 0)
		})
}

async function getClassifiedSingers() {
	singers.value = []
	await api.getClassifiedSingers()
		.then((res) => {
			singers.value = res.data || {}
			setTimeout(() => {
				setTableWrapperScroll()
				table2.value.refresh()
			}, 0)
		})
}


function handleEnterKey() {
	searchSinger()
	document.querySelector('.searchBt').focus()
}

function goToView(view) {
	currentView.value = view
	switch (view) {
		case 0:
			getSingers()
			break
		case 1:
			getRatedSingers()
			break
		case 2:
			getClassifiedSingers()
			break
	}
}

function handleRefreshTable() {
	switch (currentView.value) {
		case 0:
			getSingers()
			break
		case 1:
			getRatedSingers()
			break
		case 2:
			getClassifiedSingers()
			break
	}
}

onBeforeUnmount(() => {
	document.removeEventListener('refreshTable', handleRefreshTable)
})
</script>

<style scoped>
nav {
	border-radius: 0 0 .5rem 0;
	width: fit-content;
	overflow: hidden;
	background: linear-gradient(145deg, var(--dark-bg2), var(--dark-bg1));
	box-shadow: var(--dark-box-shadow);
	position: absolute;
	top: v-bind(navTop);
	transition: .3s;
	left: 0;
	z-index: 2;
}

.light-theme nav {
	background: linear-gradient(145deg, var(--light-bg2), var(--light-bg1));
	box-shadow: var(--light-box-shadow);
}

.buttonsWrapper {
	padding: 7px 17px;
	display: flex;
	gap: 7px;
}

.tabBt {
	background: linear-gradient(145deg, var(--dark-bg3), var(--dark-bg1));
	font-weight: bold;
}

.light-theme .tabBt {
	background: linear-gradient(145deg, var(--light-bg3), var(--light-bg1));
	color: var(--light-font1);
}

.tabBt.active {
	background: linear-gradient(145deg, var(--primary-light), var(--primary));
	color: var(--dark-font1);
}

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