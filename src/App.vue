<script>
import List from './components/List.vue';

export default {
    name: "app",
    data() {
        return {
			pageStack: [List],
        };
	},
	watch: {
		pageStack: function (value) {
			console.log(value);
		}
	}
};
</script>

<template lang="pug">
v-ons-navigator(
	:pageStack="pageStack",
	@pushPage="pageStack.push($event)"
)
</template>
