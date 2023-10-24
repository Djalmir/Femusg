export function dispatchEvent(eventName, detail) {
	document.dispatchEvent(new CustomEvent(eventName, { detail: detail }))
}

export function cpfMask(value) {
	return value
		.replace(/\D/g, '')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d{1,2})/, '$1-$2')
		.replace(/(-\d{2})\d+?$/, '$1')
}

export function rateMask(e, scope, key) {
	let input = e.target
	input.maxLength = input.value.startsWith('1,0') ? 5 : 4
	input.value = input.value
		.replace(/\D/g, '')
	input.value = input.value.length <= 2 ? input.value.replace(/(\d{1})(\d)/, '$1,$2') : input.value.replace(/(\d{1,2})(\d{2})/, '$1,$2')
	function verifyMax(input) {
		if (Number(input.value.replace(',', '.') > 10)) {
			input.value = '10,00'
		}
		input.removeEventListener('blur', () => verifyMax(input))
	}
	input.addEventListener('blur', () => verifyMax(input))
	if (scope && key)
		scope[key] = input.value
}