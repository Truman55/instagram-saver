<script>
import Header from "./components/Header.vue";
import BaseInput from "./components/BaseInput.vue";
import Loader from "./components/Loader.vue";

import matchInstagramId from './common/helpers/matchInstagramId';
import get from 'lodash.get';

import '@/assets/download.svg?sprite';
import '@/assets/telegram.svg?sprite';

export default {
    name: "app",
    components: {
        Header,
		BaseInput,
		Loader
    },
    data() {
        return {
			instagramUrl: '',
			loading: false,
			photos: []
        };
	},
	methods: {
		async validateLink (value) {
			const id = matchInstagramId(value);

			if (id) {
				this.loading = true;
				const response = await fetch(`https://www.instagram.com/p/${id}/?__a=1`);
				const { graphql } = await response.json();
				const multiplePost = get(graphql, 'shortcode_media.edge_sidecar_to_children.edges', []);

				if (multiplePost.length) {
					for (let post of multiplePost) {
						const { node } = post;
						const imageData = get(node, 'display_resources', []);

						if (!imageData.length || node.is_video) {
							return
						}
						
						const src = imageData[imageData.length - 1]['src'];
						const image = await fetch(src);
						const blob = await image.blob();
						this.photos.push(URL.createObjectURL(blob));
					}
				} else {
					const isVideo = get(graphql, 'shortcode_media.is_video', false);
					if (isVideo) {
						throw new Error('В посте нет фотографий');
					}

					const singlePostArray = get(graphql, 'shortcode_media.display_resources', []);
					const src = singlePostArray[singlePostArray.length - 1]['src'];
					const image = await fetch(src);
					const blob = await image.blob();
					this.photos.push(URL.createObjectURL(blob));
				}
				this.loading = false;
			}
		},
		onReset () {
			this.instagramUrl = '';
		}
	},
	watch: {
		instagramUrl: function (value, oldValue) {
			if (oldValue && !value && this.photos.length) {
				this.photos.forEach(photo => URL.revokeObjectURL(photo));
				this.photos = [];
				return;
			}

			this.validateLink(value);
		}
	}
};
</script>

<template lang="pug">
#app.app
	Header
	Loader.app__loader(v-if="loading")
	main.layout-wrapper.app__main
		.grid-row
			.grid-item-12
				BaseInput(
					v-model="instagramUrl",
					placeholder="Вставьте ссылку на пост из Instagram",
					@reset="onReset"
				)
			.grid-item-3(v-for="photo in photos")
				a.app__download(:href="photo" download)
					img.app__photo(:src="photo")

					span.app__download-icon
						Icon(
							iconName="download"
						)

		.grid-row 
			.grid-item-12
				a.app__telegram(href="https://t.me/truman55" target="_blank")
					span.app__telegram-icon
						Icon(iconName="telegram")
					| Truman55
</template>

<style lang="scss">
@import "./styles/styles";
</style>

<style lang="scss" scoped>
@import "./styles/variables";

.app {
	$root: &;

    background: $main;
    padding-top: $headerHeight;
	min-height: 100vh;
	
	&__loader {
		position: fixed;
		bottom: $grid-gap*2;
		right: $grid-gap*2;
	}

    &__main {
        padding-top: $grid-gap*2;
    }

	&__photo {
		width: 100%;
		display: block;
		height: auto;
		padding: $grid-gap 0;
	}

	&__download {
		display: block;
		color: #fff;

		&-icon {
			width: $grid-gap*10;
			height: $grid-gap*10;
			display: block;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			opacity: .3;
			transition: opacity .3s;
		}

		&:hover {
			#{$root}__download-icon {
				opacity: 1;
			}
		}
	}

	&__telegram {
		text-decoration: none;
		font-weight: bold;
		display: inline-flex;
		align-items: center;
		text-align: center;
		position: fixed;
		bottom: $grid-gap*2;
		left: $grid-gap*2;
		color:#fff;
		padding: $grid-gap;
		background: rgba(#000, .3);
		border-radius: $grid-gap/2;

		&:hover {
			color: $blackLight;
		}
	}

	&__telegram-icon {
		width: $grid-gap*3;
		height: $grid-gap*3;
		display: inline-block; 
		margin-right: $grid-gap;
	}
}
</style>