<template>
	<svg :width="size" :height="size" :class="className">
		<use :href="`/svgLib.svg#${className.split(' ')[0]}`" />
	</svg>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
	size: {
		type: Number,
		default: 1
	},
	class: {
		type: String,
		required: true
	}
})
const className = computed(() => { return props.class })
const minSize = props.size + 'rem'
</script>

<style scoped>
svg {
	fill: currentColor;
}

svg {
	border-radius: .4rem;
	min-width: v-bind(minSize);
	min-height: v-bind(minSize);
	width: v-bind(minSize);
	height: v-bind(minSize);
}
</style>