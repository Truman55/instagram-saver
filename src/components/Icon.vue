<script>
export default {
	name: 'Icon',
	props: {
		iconName: {
			type: String,
			required: true
		}
	}
};
</script>

<template lang="pug">
svg.svg-icon
	use(:xlink:href="`#${iconName}--sprite`")
</template>

<style lang="scss" scoped>
.svg-icon {
	width: 100%;
	height: 100%;
	fill: currentColor
}
</style>
