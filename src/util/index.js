export function ObjectToFormData(object) {
	return Object.entries(object)
		.reduce((formData, [key, value]) => {
			formData.append(key, value)
			return formData
		}, new FormData())
}