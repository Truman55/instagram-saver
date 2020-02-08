<script>
import matchInstagramId from '../common/helpers/matchInstagramId';
import { Loader } from '../common/helpers/Loader';

export default {
    data () {
        return {
            instagramUrl: '',
            matchedId: null,
            loading: false,
            photos: null,
        }
    },
    methods: {
        alert (text) {
            this.$ons.notification.alert(text);
        },
        validate () {
            const id = matchInstagramId(this.instagramUrl);

            if (id) {
                this.matchedId = id;
                this.loadImages(id);
                return;
            }

            if (this.instagramUrl.length) {
                this.alert('Не удалось раcпознать ссылку');
            }
        },
        loadImages (id) {
            this.loading = true;

            new Loader(id, this.onSuccess, this.onError);
        },
        onSuccess ({ photos }) {
            this.loading = false;
            const posts = JSON.parse(window.localStorage.getItem('posts') || '[]');

            if (Array.isArray(posts)) {
                posts.push({
                    url: this.instagramUrl,
                    id: this.matchedId
                });

                window.localStorage.setItem('posts', JSON.stringify(posts));
                this.photos = photos;
            }
        },
        async onError ({ message }) {
            this.loading = false;
            await this.$nextTick();
            this.alert(message);
            this.matchedId = null;
            this.instagramUrl = '';
        },
        saveToFileSystem (src) {
            console.log(src);
        }
    },
    watch: {
        instagramUrl: function () {
            this.validate();
        }
    }
}
</script>

<template lang="pug">
v-ons-page.post
    v-ons-toolbar
        .left
            v-ons-back-button Назад к списку

        .center(v-if="!matchedId") Сохранить новый пост
        .center(v-else) Пост: {{ matchedId }}

    .post__wrapper
        v-ons-input.post__input(
            v-if="!matchedId",
            v-model="instagramUrl",
            placeholder="Ссылка на пост",
            model-event="change",
            float
        )

        template(v-if="photos")
            .post__image-wrap(
                v-for="photo in photos",
                @click="saveToFileSystem(photo)"
            )
                img.post__image(
                    :src="photo"
                )

    v-ons-modal(
        :visible="loading",
    )
        p(style="text-align: center")
            | Загружаем фото
            br
            br
            v-ons-icon(icon="fa-spinner" spin)

</template>

<style lang="scss">
.post {
    &__input {
        width: 90%;
    }

    &__wrapper {
        display: flex;
        align-items: center;
        flex-direction: column;
        padding-top: 24px;
    }

    &__image {
        max-width: 100%;
        height: auto;

        &-wrap {
            border: 6px solid white;
            border-radius: 8px;
            overflow: hidden;
            margin: 0 24px 24px;
        }
    }
}
</style>