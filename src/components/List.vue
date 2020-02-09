<script>
import Post from './Post.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'List',
    computed: {
        ...mapGetters([
            'posts'
        ])
    },
    methods: {
        goToPost (isNew = false) {
            if (isNew) {
                this.setActivePost(null);
            }

            this.$emit('pushPage', Post);
        },
        editPost(post) {
            this.setActivePost(post);
            this.goToPost();
        },
        ...mapActions([
            'getPosts',
            'setActivePost'
        ])
    },
    created () {
        this.getPosts();
    },
};
</script>

<template lang="pug">
v-ons-page.list
    v-ons-toolbar
        .center Instagram Saver

    .list-main
        v-ons-list(v-if="posts.length")
            v-ons-list-header Последние посты
            v-ons-list-item(
                v-for="post in posts",
                tappable,
                @click="editPost(post)"
            ) {{ post.name }}
        
        template(v-else)
            p.empty-text Вы еще не сохранили ни одного поста

    v-ons-fab(
        position='bottom right'
        visible,
        @click="goToPost(true)"
    )
        | +
</template>

<style lang="scss" scoped>
.empty-text {
    text-align: center;
}
</style>