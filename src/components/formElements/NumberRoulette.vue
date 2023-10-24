<template>
	<div class="rouletteWrapper">
		<div class="roulette">
			<div></div>
			<div v-if="showTen" value="10">10</div>
			<div value="9">9</div>
			<div value="8">8</div>
			<div value="7">7</div>
			<div value="6">6</div>
			<div value="5">5</div>
			<div value="4">4</div>
			<div value="3">3</div>
			<div value="2">2</div>
			<div value="1">1</div>
			<div value="0">0</div>
			<div></div>
		</div>
	</div>
</template>

<script setup>

const props = defineProps(['showTen'])

</script>

<style scoped>
.rouletteWrapper {
	height: 100%;
	font-size: 1.25em;
	overflow: auto;
	padding: 0 17px;
	background: linear-gradient(to bottom, var(--dark-bg1), var(--dark-bg3), var(--dark-bg1));
	box-shadow: inset 0 0 2px 1px #000000d0;
	border-radius: .5rem;
}

.light-theme .rouletteWrapper {
	background: linear-gradient(to bottom, var(--light-bg1), var(--light-bg3), var(--light-bg1));
	box-shadow: inset 0 0 2px 1px #00000080;
}

.rouletteWrapper::-webkit-scrollbar {
	width: 0;
	height: 0;
}

.roulette {
	margin: 7px 0;
	display: flex;
	flex-direction: column;
	padding: 3px 0;
	gap: 13px;
	text-align: center;
}
</style>