<script>
import matchInstagramId from '../common/helpers/matchInstagramId';
import { Loader } from '../common/helpers/Loader';
import { mapActions, mapState } from 'vuex';
import { downloadToDevice } from '../common/helpers/downloadFile';

export default {
    data () {
        return {
            instagramUrl: '',
            matchedId: null,
            loading: false,
            photos: null,
            post: null
        }
    },
    computed: {
        ...mapState([
            'activePost'
        ]),
        isNew () {
            return !this.post && this.instagramUrl;
        }
    },
    methods: {
        error (text) {
            this.$ons.notification.alert(text, {
                title: 'Ошибка'
            });
        },
        validate () {
            const id = matchInstagramId(this.instagramUrl);

            if (id) {
                this.matchedId = id;
                this.loadImages(id);
                return;
            }

            if (this.instagramUrl.length) {
                this.error('Не удалось раcпознать ссылку');
            }
        },
        loadImages (id) {
            this.loading = true;

            new Loader(id, this.onSuccess, this.onError);
        },
        onSuccess ({ photos }) {
            if (this.isNew) {
                const newPost = {
                    name: this.instagramUrl,
                    id: this.matchedId,
                    uid: Date.now()
                };

                this.post = newPost;
                this.saveNewPost(newPost);
            }

            this.photos = photos;
            this.loading = false;
        },
        async onError ({ message }) {
            this.loading = false;
            await this.$nextTick();
            this.error(message);

            if (this.isNew) {
                this.matchedId = null;
                this.instagramUrl = '';
            }
        },
        editPostName () {
            this.$ons.notification.prompt('Введите название поста', {
                title: 'Редактирование имени',
                defaultValue: this.post.name,
                callback: (postName) => {
                    if (postName) {
                        this.post = {
                            ...this.post,
                            name: postName
                        }

                        this.updatePost(this.post);
                    }
                }
            });
        },
        async saveToFileSystem (src) {
            try {
                await downloadToDevice(
                    src,
                    this.matchedId
                );
                this.$ons.notification.alert('Фото сохранено на устройство', {
                    title: 'Успех!'
                })
            } catch (err) {
                this.error('Не удалось сохранить фото на устройство :(');
            }
        },
        ...mapActions([
            'saveNewPost',
            'updatePost'
        ])
    },
    watch: {
        instagramUrl: function () {
            this.validate();
        }
    },
    async created () {
        if (this.activePost) {
            this.post = this.activePost;
            this.matchedId = this.activePost.id;
            this.loadImages(this.matchedId);
        }
    }
}
</script>

<template lang="pug">
v-ons-page.post
    v-ons-toolbar
        .left
            v-ons-back-button Назад к списку

        .center(v-if="!post") Сохранить новый пост
        .center(v-else) {{ post.name }}
        .right(v-show="post")
            v-ons-toolbar-button(
                icon="ion-navicon, material: md-edit",
                @click="editPostName"
            )

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
                v-for="photo in photos"
            )
                img.post__image(
                    :src="photo"
                )

                v-ons-button.post__save-photo(
                    @click="saveToFileSystem(photo)"
                ) Сохранить

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
            position: relative;
        }
    }

    &__save-photo {
        position: absolute;
        bottom: 16px;
        left: 16px;
    }
}
</style>